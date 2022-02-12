using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Email;
using API.Infrastructure.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Infrastructure.Identity {

    [Route("api/[controller]")]
    public class UsersController : ControllerBase {

        #region variables

        private readonly IEmailSender emailSender;
        private readonly UserManager<UserExtended> userManager;

        #endregion

        public UsersController(IEmailSender emailSender, UserManager<UserExtended> userManager) {
            this.emailSender = emailSender;
            this.userManager = userManager;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<UserListViewModel>> Get() {
            return await userManager.Users.Select(u => new UserListViewModel {
                Id = u.Id,
                UserName = u.UserName,
                DisplayName = u.DisplayName,
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
            UserReadResource vm = new() {
                Id = record.Id,
                UserName = record.UserName,
                DisplayName = record.DisplayName,
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
        public async Task<IActionResult> PutUser([FromRoute] string id, [FromBody] UserWriteResource record) {
            if (id == record.Id && ModelState.IsValid) {
                UserExtended user = await userManager.FindByIdAsync(id);
                if (record != null) {
                    await UpdateUser(user, record);
                    await UpdateRole(user);
                    return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
                }
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            return StatusCode(400, new {
                response = ApiMessages.InvalidModel()
            });

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

        private async Task<IdentityResult> UpdateUser(UserExtended user, UserWriteResource record) {
            user.UserName = record.UserName;
            user.DisplayName = record.DisplayName;
            user.CustomerId = record.CustomerId;
            user.Email = record.Email;
            user.IsAdmin = record.IsAdmin;
            user.IsActive = record.IsActive;
            return await userManager.UpdateAsync(user);
        }

        private async Task UpdateRole(UserExtended user) {
            var roles = await userManager.GetRolesAsync(user);
            await userManager.RemoveFromRolesAsync(user, roles);
            await userManager.AddToRoleAsync(user, user.IsAdmin ? "admin" : "user");
        }

    }

}