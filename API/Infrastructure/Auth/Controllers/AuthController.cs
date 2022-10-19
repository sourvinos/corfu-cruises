using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Features.Users;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace API.Infrastructure.Auth {

    [Route("api/[controller]")]
    public class AuthController : ControllerBase {

        #region variables

        private readonly AppDbContext context;
        private readonly TokenSettings settings;
        private readonly UserManager<UserExtended> userManager;

        #endregion

        public AuthController(AppDbContext context, IOptions<TokenSettings> settings, UserManager<UserExtended> userManager) {
            this.context = context;
            this.settings = settings.Value;
            this.userManager = userManager;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Auth([FromBody] TokenRequest model) {
            return model.GrantType switch {
                "password" => await GenerateNewToken(model),
                "refresh_token" => await RefreshToken(model),
                _ => AuthenticationFailed(),
            };
        }

        [HttpPost("[action]")]
        public IActionResult Logout([FromBody] string userId) {
            var tokens = context.Tokens.Where(x => x.UserId == userId).ToList();
            context.Tokens.RemoveRange(tokens);
            context.SaveChanges();
            return StatusCode(200, new {
                response = ApiMessages.OK()
            });
        }

        private async Task<IActionResult> GenerateNewToken(TokenRequest model) {
            var user = await userManager.FindByNameAsync(model.Username);
            if (user?.IsActive == true && await userManager.IsEmailConfirmedAsync(user) && await userManager.CheckPasswordAsync(user, model.Password)) {
                var newRefreshToken = CreateRefreshToken(settings.ClientId, user.Id);
                var oldRefreshTokens = context.Tokens.Where(rt => rt.UserId == user.Id);
                if (oldRefreshTokens != null) {
                    foreach (var token in oldRefreshTokens) {
                        context.Tokens.Remove(token);
                    }
                }
                context.Tokens.Add(newRefreshToken);
                await context.SaveChangesAsync();
                var response = await CreateAccessToken(user, newRefreshToken.Value);
                return StatusCode(200, new TokenResponse {
                    Displayname = response.Displayname,
                    Token = response.Token,
                    RefreshToken = response.RefreshToken,
                    Expiration = response.Expiration,
                });
            } else {
                return AuthenticationFailed();
            }
        }

        private static Token CreateRefreshToken(string clientId, string userId) {
            return new Token() {
                ClientId = clientId,
                UserId = userId,
                Value = Guid.NewGuid().ToString("N"),
                CreatedDate = DateTime.UtcNow,
                ExpiryTime = DateTime.UtcNow.AddMinutes(90)
            };
        }

        private async Task<TokenResponse> CreateAccessToken(UserExtended user, string refreshToken) {
            double tokenExpiryTime = Convert.ToDouble(settings.ExpireTime);
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(settings.Secret));
            var roles = await userManager.GetRolesAsync(user);
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Role, roles.FirstOrDefault()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                    new Claim("LoggedOn", DateTime.UtcNow.ToString())
                    }),
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                Issuer = settings.Site,
                Audience = settings.Audience,
                Expires = DateTime.UtcNow.AddMinutes(tokenExpiryTime)
            };
            var newtoken = tokenHandler.CreateToken(tokenDescriptor);
            var encodedToken = tokenHandler.WriteToken(newtoken);
            var response = new TokenResponse() {
                Displayname = user.Displayname,
                Token = encodedToken,
                RefreshToken = refreshToken,
                Expiration = newtoken.ValidTo,
            };
            return response;
        }

        private async Task<IActionResult> RefreshToken(TokenRequest model) {
            try {
                var refreshToken = context.Tokens.FirstOrDefault(t => t.ClientId == settings.ClientId && t.Value == model.RefreshToken);
                if (refreshToken == null) return AuthenticationFailed();
                if (refreshToken.ExpiryTime < DateTime.UtcNow) return AuthenticationFailed();
                var user = await userManager.FindByIdAsync(refreshToken.UserId);
                if (user == null) return AuthenticationFailed();
                var rtNew = CreateRefreshToken(refreshToken.ClientId, refreshToken.UserId);
                context.Tokens.Remove(refreshToken);
                context.Tokens.Add(rtNew);
                context.SaveChanges();
                var token = await CreateAccessToken(user, rtNew.Value);
                return StatusCode(200, new {
                    response = token
                });
            } catch {
                return AuthenticationFailed();
            }
        }

        private IActionResult AuthenticationFailed() {
            return StatusCode(404, new {
                response = ApiMessages.AuthenticationFailed()
            });
        }

    }

}