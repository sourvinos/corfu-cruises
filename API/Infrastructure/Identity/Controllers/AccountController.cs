using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Infrastructure.Email;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace API.Infrastructure.Identity {

    [Route("api/[controller]")]
    public class AccountController : Controller {

        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IEmailSender emailSender;
        private readonly SignInManager<UserExtended> signInManager;
        private readonly UserManager<UserExtended> userManager;

        public AccountController(IHttpContextAccessor httpContextAccessor, UserManager<UserExtended> userManager, SignInManager<UserExtended> signInManager, IEmailSender emailSender) {
            this.httpContextAccessor = httpContextAccessor;
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.emailSender = emailSender;
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<Response> ForgotPassword([FromBody] ForgotPasswordViewModel model) {
            if (ModelState.IsValid) {
                return await SendEmailAsync(model);
            } else {
                return new Response {
                    Code = 497,
                    Icon = Icons.Error.ToString(),
                    Message = ApiMessages.InvalidModel()
                };
            }
        }

        [AllowAnonymous]
        [HttpGet("[action]")]
        public IActionResult ResetPassword([FromQuery] string email, [FromQuery] string tokenEncoded) {
            var model = new ResetPasswordViewModel {
                Email = email,
                Token = tokenEncoded
            };
            return StatusCode(200, new { response = model });
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel model) {
            if (ModelState.IsValid) {
                var user = await userManager.FindByEmailAsync(model.Email);
                if (user != null) {
                    var result = await userManager.ResetPasswordAsync(user, Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token)), model.Password);
                    if (result.Succeeded) {
                        await signInManager.RefreshSignInAsync(user);
                        return StatusCode(200, new { response = ApiMessages.OK() });
                    }
                    return StatusCode(494, new { response = result.Errors.Select(x => x.Description) });
                }
                return StatusCode(404, new { response = ApiMessages.RecordNotFound() });
            }
            return StatusCode(400, new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel vm) {
            if (ModelState.IsValid) {
                var user = await userManager.FindByIdAsync(vm.UserId);
                if (user != null) {
                    var result = await userManager.ChangePasswordAsync(user, vm.CurrentPassword, vm.Password);
                    if (result.Succeeded) {
                        await signInManager.RefreshSignInAsync(user);
                        return StatusCode(200, new { response = ApiMessages.OK() });
                    }
                    return StatusCode(494, new { response = result.Errors.Select(x => x.Description) });
                }
                return StatusCode(404, new { response = ApiMessages.RecordNotFound() });
            }
            return StatusCode(400, new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
        }

        [Authorize]
        [HttpGet("[action]")]
        public Task<bool> IsConnectedUserAdmin() {
            return Extensions.Identity.IsUserAdmin(httpContextAccessor);
        }

        [Authorize]
        [HttpGet("[action]")]
        public Task<SimpleUser> GetConnectedUserId() {
            return Extensions.Identity.GetConnectedUserId(httpContextAccessor);
        }

        private async Task<Response> SendEmailAsync(ForgotPasswordViewModel model) {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user != null && await userManager.IsEmailConfirmedAsync(user)) {
                string token = await userManager.GeneratePasswordResetTokenAsync(user);
                string tokenEncoded = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
                string baseUrl = $"{model.ReturnUrl}";
                string passwordResetLink = Url.Content($"{baseUrl}/#/resetPassword?email={model.Email}&token={tokenEncoded}");
                var response = emailSender.SendResetPasswordEmail(user.Displayname, user.Email, passwordResetLink, model.Language);
                return response.Successful ? new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                } : new Response {
                    Code = 498,
                    Icon = Icons.Error.ToString(),
                    Message = ApiMessages.EmailNotSent()
                };
            } else {
                return new Response {
                    Code = 498,
                    Icon = Icons.Error.ToString(),
                    Message = ApiMessages.EmailNotSent()
                };
            }
        }

    }

}