using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises {

    [Route("api/[controller]")]

    public class UsersController : ControllerBase {

        private readonly IEmailSender emailSender;
        private readonly ILogger<UsersController> logger;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly UserManager<AppUser> userManager;

        public UsersController(IEmailSender emailSender, ILogger<UsersController> logger, RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager) {
            this.emailSender = emailSender;
            this.logger = logger;
            this.roleManager = roleManager;
            this.userManager = userManager;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
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

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id) {
            AppUser record = await userManager.Users.Include(x => x.Customer).Where(x => x.Id == id).SingleOrDefaultAsync();
            if (record == null) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            UserViewModel vm = new UserViewModel {
                Id = record.Id,
                UserName = record.UserName,
                DisplayName = record.DisplayName,
                CustomerId = record.CustomerId,
                CustomerDescription = record.Customer.Description,
                Email = record.Email,
                IsAdmin = record.IsAdmin,
                IsActive = record.IsActive
            };
            return StatusCode(200, vm);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser([FromRoute] string id, [FromBody] UserViewModel vm) {
            if (id == vm.Id && ModelState.IsValid) {
                AppUser record = await userManager.FindByIdAsync(id);
                if (record != null) {
                    await UpdateUser(record, vm);
                    await UpdateRole(record);
                    return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
                }
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            LoggerExtensions.LogException(0, logger, ControllerContext, vm, null);
            return StatusCode(400, new {
                response = ApiMessages.InvalidModel()
            });

        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id) {
            AppUser record = await userManager.FindByIdAsync(id);
            if (record == null) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            try {
                IdentityResult result = await userManager.DeleteAsync(record);
                return StatusCode(200, new {
                    response = ApiMessages.RecordDeleted()
                });
            } catch (DbUpdateException exception) {
                LoggerExtensions.LogException(0, logger, ControllerContext, record, exception);
                return StatusCode(491, new {
                    response = ApiMessages.RecordInUse()
                });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("[action]")]
        public IActionResult SendLoginCredentials([FromBody] LoginCredentialsViewModel model) {
            string baseUrl = $"{Request.Scheme}://{Request.Host.Value}{Request.PathBase.Value}";
            string loginLink = Url.Content($"{baseUrl}/login");
            var result = emailSender.SendLoginCredentials(model, loginLink);
            if (result.Successful) {
                return StatusCode(200, new { response = ApiMessages.EmailInstructions() });
            }
            return StatusCode(496, new { response = ApiMessages.EmailNotSent() });
        }

        private async Task<IdentityResult> UpdateUser(AppUser user, UserViewModel vm) {
            user.UserName = vm.UserName;
            user.DisplayName = vm.DisplayName;
            user.Email = vm.Email;
            user.IsAdmin = vm.IsAdmin;
            user.IsActive = vm.IsActive;
            user.CustomerId = vm.CustomerId;
            return await userManager.UpdateAsync(user);
        }

        private async Task UpdateRole(AppUser user) {
            var roles = await userManager.GetRolesAsync(user);
            await userManager.RemoveFromRolesAsync(user, roles);
            await userManager.AddToRoleAsync(user, user.IsAdmin ? "Admin" : "User");
        }

    }

}