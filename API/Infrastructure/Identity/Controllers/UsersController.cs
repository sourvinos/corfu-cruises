using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Auth;
using API.Infrastructure.Classes;
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

        private readonly AppDbContext dbContext;
        private readonly IEmailSender emailSender;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMapper mapper;
        private readonly UserManager<UserExtended> userManager;

        #endregion

        public UsersController(AppDbContext dbContext, IEmailSender emailSender, IHttpContextAccessor httpContextAccessor, IMapper mapper, UserManager<UserExtended> userManager) {
            this.dbContext = dbContext;
            this.emailSender = emailSender;
            this.httpContextAccessor = httpContextAccessor;
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

        [HttpPut("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<Response> PutUser([FromRoute] string id, [FromBody] UserUpdateDto record) {
            if (ModelState.IsValid) {
                UserExtended user = await userManager.FindByIdAsync(id);
                if (record != null) {
                    if (await UpdateUserAsync(user, record)) {
                        await UpdateRole(user);
                        return ApiResponses.OK();
                    } else {
                        throw new CustomException { HttpResponseCode = 498 };
                    }
                } else {
                    throw new CustomException { HttpResponseCode = 404 };
                }
            } else {
                throw new CustomException { HttpResponseCode = 498 };
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteUser(string id) {
            await userManager.DeleteAsync(await userManager.FindByIdAsync(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
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

        private async Task<bool> UpdateUserAsync(UserExtended user, UserUpdateDto record) {
            var result = await userManager.UpdateAsync(await CreateUpdatedUserAsync(user, record));
            return result.Succeeded;
        }

        private async Task<UserExtended> CreateUpdatedUserAsync(UserExtended user, UserUpdateDto record) {
            user.UserName = record.UserName;
            user.Displayname = record.Displayname;
            if (await IsAdmin()) {
                user.CustomerId = record.CustomerId == 0 ? null : record.CustomerId;
                user.Email = record.Email;
                user.IsAdmin = record.IsAdmin;
                user.IsActive = record.IsActive;
            }
            return user;
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