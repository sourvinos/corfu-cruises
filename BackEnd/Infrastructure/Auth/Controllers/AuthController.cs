using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Extensions;
using BlueWaterCruises.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace BlueWaterCruises.Infrastructure.Auth {

    [Route("api/[controller]")]
    public class AuthController : ControllerBase {

        private readonly AppDbContext db;
        private readonly TokenSettings settings;
        private readonly UserManager<UserExtended> userManager;

        public AuthController(AppDbContext db, IOptions<TokenSettings> settings, UserManager<UserExtended> userManager) {
            this.db = db;
            this.settings = settings.Value;
            this.userManager = userManager;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Auth([FromBody] TokenRequest model) {
            return model.GrantType switch {
                "password" => await GenerateNewToken(model),
                "refresh_token" => await RefreshToken(model),
                _ => StatusCode(401, new {
                    response = ApiMessages.AuthenticationFailed()
                }),
            };
        }

        [HttpPost("[action]")]
        public IActionResult Logout([FromBody] string userId) {
            var tokens = db.Tokens.Where(x => x.UserId == userId).ToList();
            if (tokens != null) {
                db.Tokens.RemoveRange(tokens);
                db.SaveChanges();
                return StatusCode(200, new {
                    response = ApiMessages.LogoutSuccess()
                });
            }
            return StatusCode(404, new {
                response = ApiMessages.LogoutError()
            });
        }

        private async Task<IActionResult> GenerateNewToken(TokenRequest model) {
            var user = await userManager.FindByNameAsync(model.Username);
            if (user?.IsActive == true && await userManager.CheckPasswordAsync(user, model.Password)) {
                var newRefreshToken = CreateRefreshToken(settings.ClientId, user.Id);
                var oldRefreshTokens = db.Tokens.Where(rt => rt.UserId == user.Id);
                if (oldRefreshTokens != null) {
                    foreach (var token in oldRefreshTokens) {
                        db.Tokens.Remove(token);
                    }
                }
                db.Tokens.Add(newRefreshToken);
                await db.SaveChangesAsync();
                var response = await CreateAccessToken(user, newRefreshToken.Value);
                return StatusCode(200, new TokenResponse {
                    Token = response.Token,
                    Expiration = response.Expiration,
                    Refresh_token = response.Refresh_token,
                    Roles = response.Roles,
                    UserId = response.UserId,
                    Displayname = response.Displayname,
                    CustomerId = response.CustomerId
                });
            }
            return StatusCode(401, new {
                response = ApiMessages.AuthenticationFailed()
            });
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
                    new Claim("LoggedOn", DateTime.Now.ToString()),
                    }),
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                Issuer = settings.Site,
                Audience = settings.Audience,
                Expires = DateTime.UtcNow.AddMinutes(tokenExpiryTime)
            };
            var newtoken = tokenHandler.CreateToken(tokenDescriptor);
            var encodedToken = tokenHandler.WriteToken(newtoken);
            return new TokenResponse() {
                Token = encodedToken,
                Expiration = newtoken.ValidTo,
                Refresh_token = refreshToken,
                Roles = roles.FirstOrDefault(),
                UserId = user.Id,
                Displayname = user.DisplayName,
                CustomerId = user.CustomerId
            };
        }

        private async Task<IActionResult> RefreshToken(TokenRequest model) {
            try {
                var refreshToken = db.Tokens.FirstOrDefault(t => t.ClientId == settings.ClientId && t.Value == model.RefreshToken);
                if (refreshToken == null) return StatusCode(401, new { response = ApiMessages.AuthenticationFailed() });
                if (refreshToken.ExpiryTime < DateTime.UtcNow) return StatusCode(401, new { response = ApiMessages.AuthenticationFailed() });
                var user = await userManager.FindByIdAsync(refreshToken.UserId);
                if (user == null) return StatusCode(401, new { response = ApiMessages.AuthenticationFailed() });
                var rtNew = CreateRefreshToken(refreshToken.ClientId, refreshToken.UserId);
                db.Tokens.Remove(refreshToken);
                db.Tokens.Add(rtNew);
                db.SaveChanges();
                var token = await CreateAccessToken(user, rtNew.Value);
                return StatusCode(200, new { response = token });
            } catch {
                return StatusCode(401, new { response = ApiMessages.AuthenticationFailed() });
            }
        }

    }

}