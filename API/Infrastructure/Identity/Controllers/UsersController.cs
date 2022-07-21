using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Email;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Infrastructure.Identity {

    [Route("api/[controller]")]
    public class UsersController : ControllerBase {

        #region variables

        private readonly IEmailSender emailSender;
        private readonly IMapper mapper;
        private readonly UserManager<UserExtended> userManager;

        #endregion

        public UsersController(IEmailSender emailSender, IMapper mapper, UserManager<UserExtended> userManager) {
            this.emailSender = emailSender;
            this.mapper = mapper;
            this.userManager = userManager;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<UserListDto>> Get() {
            return await userManager.Users.Select(u => new UserListDto {
                Id = u.Id,
                UserName = u.UserName,
                Displayname = u.Displayname,
                Email = u.Email,
                IsAdmin = u.IsAdmin,
                IsActive = u.IsActive
            }).OrderBy(o => o.UserName).AsNoTracking().ToListAsync();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<IActionResult> GetUser(string id) {
            UserExtended record = await userManager.Users
                .Include(x => x.Customer)
                .DefaultIfEmpty()
                .SingleOrDefaultAsync(x => x.Id == id);
            if (record == null) {
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            UserReadDto vm = new() {
                Id = record.Id,
                UserName = record.UserName,
                Displayname = record.Displayname,
                Customer = new SimpleResource {
                    Id = (record.Customer?.Id) ?? 0,
                    Description = (record.Customer?.Description) ?? "(EMPTY)"
                },
                Email = record.Email,
                IsAdmin = record.IsAdmin,
                IsActive = record.IsActive
            };
            return StatusCode(200, vm);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<Response> PostUserAsync([FromBody] UserNewDto record) {
            var user = mapper.Map<UserNewDto, UserExtended>(record);
            var result = await userManager.CreateAsync(user, record.Password);
            if (result.Succeeded) {
                await userManager.AddToRoleAsync(user, user.IsAdmin ? "Admin" : "User");
                return ApiResponses.OK();
            } else {
                throw new CustomException { HttpResponseCode = 495 };
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<Response> PutUserAsync([FromRoute] string id, [FromBody] UserUpdateDto record) {
            UserExtended user = await userManager.FindByIdAsync(id);
            if (user != null) {
                if (await UpdateUser(CreateUpdatedUser(user, record))) {
                    await UpdateRole(user);
                    return ApiResponses.OK();
                } else {
                    throw new CustomException { HttpResponseCode = 497 };
                }
            } else {
                throw new CustomException { HttpResponseCode = 404 };
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> DeleteUserAsync(string id) {
            await userManager.DeleteAsync(await userManager.FindByIdAsync(id));
            return ApiResponses.OK();
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "admin")]
        public IActionResult SendLoginCredentials([FromBody] LoginCredentialsViewModel model) {
            string baseUrl = $"{Request.Scheme}://{Request.Host.Value}{Request.PathBase.Value}";
            string loginLink = Url.Content($"{baseUrl}/login");
            var result = emailSender.SendLoginCredentials(model, loginLink);
            if (result.Successful) {
                return StatusCode(200, new { response = ApiMessages.EmailInstructions() });
            }
            return StatusCode(496, new { response = ApiMessages.EmailNotSent() });
        }

        private static UserExtended CreateUpdatedUser(UserExtended user, UserUpdateDto record) {
            user.UserName = record.UserName;
            user.Displayname = record.Displayname;
            user.CustomerId = record.CustomerId == 0 ? null : record.CustomerId;
            user.Email = record.Email;
            user.IsAdmin = record.IsAdmin;
            user.IsActive = record.IsActive;
            return user;
        }

        private async Task<bool> UpdateUser(UserExtended user) {
            var result = await userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        private async Task UpdateRole(UserExtended user) {
            var roles = await userManager.GetRolesAsync(user);
            await userManager.RemoveFromRolesAsync(user, roles);
            await userManager.AddToRoleAsync(user, user.IsAdmin ? "admin" : "user");
        }

    }

}