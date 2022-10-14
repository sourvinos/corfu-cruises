using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Email;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Infrastructure.Identity {

    [Route("api/[controller]")]
    public class UsersController : ControllerBase {

        #region variables

        private readonly IEmailSender emailSender;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMapper mapper;
        private readonly UserManager<UserExtended> userManager;

        #endregion

        public UsersController(IEmailSender emailSender, IHttpContextAccessor httpContextAccessor, IMapper mapper, UserManager<UserExtended> userManager) {
            this.emailSender = emailSender;
            this.httpContextAccessor = httpContextAccessor;
            this.mapper = mapper;
            this.userManager = userManager;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<UserListDto>> Get() {
            return await userManager.Users
                .AsNoTracking()
                .Select(u => new UserListDto {
                    Id = u.Id,
                    UserName = u.UserName,
                    Displayname = u.Displayname,
                    Email = u.Email,
                    IsAdmin = u.IsAdmin,
                    IsActive = u.IsActive
                })
                .OrderBy(o => o.UserName)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<Response> GetUser(string id) {
            UserExtended user = await userManager.Users
                .Include(x => x.Customer)
                .DefaultIfEmpty()
                .SingleOrDefaultAsync(x => x.Id == id);
            return user == null ? new Response {
                Code = 404,
                Icon = Icons.Error.ToString(),
                Message = ApiMessages.RecordNotFound()
            } : new Response {
                Code = 200,
                Icon = Icons.Info.ToString(),
                Message = ApiMessages.OK(),
                Body = mapper.Map<UserExtended, UserReadDto>(user)
            };
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<Response> PostUser([FromBody] UserNewDto user) {
            var x = mapper.Map<UserNewDto, UserExtended>(user);
            var result = await userManager.CreateAsync(x, user.Password);
            if (result.Succeeded) {
                await userManager.AddToRoleAsync(x, user.IsAdmin ? "Admin" : "User");
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            } else {
                return new Response {
                    Code = 492,
                    Icon = Icons.Error.ToString(),
                    Message = ApiMessages.NotUniqueUser()
                };
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<Response> PutUser([FromRoute] string id, [FromBody] UserUpdateDto user) {
            if (ModelState.IsValid) {
                UserExtended x = await userManager.FindByIdAsync(id);
                if (x != null) {
                    if (await UpdateUserAsync(x, user)) {
                        await UpdateRole(x);
                        return new Response {
                            Code = 200,
                            Icon = Icons.Success.ToString(),
                            Message = ApiMessages.OK()
                        };
                    } else {
                        return new Response {
                            Code = 498,
                            Icon = Icons.Error.ToString(),
                            Message = ApiMessages.NotUniqueUser()
                        };
                    }
                } else {
                    return new Response {
                        Code = 404,
                        Icon = Icons.Error.ToString(),
                        Message = ApiMessages.RecordNotFound()
                    };
                }
            } else {
                return new Response {
                    Code = 498,
                    Icon = Icons.Error.ToString(),
                    Message = ApiMessages.RecordNotSaved()
                };
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> DeleteUser(string id) {
            var user = Extensions.Identity.GetConnectedUserId(httpContextAccessor);
            if (id == user) {
                return new Response {
                    Code = 499,
                    Icon = Icons.Error.ToString(),
                    Message = ApiMessages.UnableToDeleteConnectedUser()
                };
            } else {
                try {
                    IdentityResult result = await userManager.DeleteAsync(await userManager.FindByIdAsync(id));
                    return new Response {
                        Code = 200,
                        Icon = Icons.Success.ToString(),
                        Message = ApiMessages.OK()
                    };
                } catch (Exception) {
                    return new Response {
                        Code = 491,
                        Icon = Icons.Error.ToString(),
                        Message = ApiMessages.RecordInUse()
                    };
                }
            }
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "admin")]
        public Response SendLoginCredentials([FromBody] LoginCredentialsViewModel model) {
            string baseUrl = $"{Request.Scheme}://{Request.Host.Value}{Request.PathBase.Value}";
            string loginLink = Url.Content($"{baseUrl}/login");
            var result = emailSender.SendLoginCredentials(model, loginLink);
            if (result.Successful) {
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            } else {
                return new Response {
                    Code = 496,
                    Icon = Icons.Error.ToString(),
                    Message = ApiMessages.EmailNotSent()
                };
            }
        }

        private async Task<bool> UpdateUserAsync(UserExtended x, UserUpdateDto user) {
            x.UserName = user.UserName;
            x.Displayname = user.Displayname;
            if (await IsAdmin()) {
                user.CustomerId = user.CustomerId == 0 ? null : user.CustomerId;
                user.Email = user.Email;
                user.IsAdmin = user.IsAdmin;
                user.IsActive = user.IsActive;
            }
            var result = await userManager.UpdateAsync(x);
            return result.Succeeded;
        }

        private async Task UpdateRole(UserExtended user) {
            var roles = await userManager.GetRolesAsync(user);
            await userManager.RemoveFromRolesAsync(user, roles);
            await userManager.AddToRoleAsync(user, user.IsAdmin ? "admin" : "user");
        }

        private async Task<bool> IsAdmin() {
            var isUserAdmin = Task.Run(() => Extensions.Identity.IsUserAdmin(httpContextAccessor));
            return await isUserAdmin;
        }

    }

}