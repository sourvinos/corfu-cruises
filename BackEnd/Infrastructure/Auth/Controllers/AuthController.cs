using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace BlueWaterCruises {

    [Route("api/[controller]")]

    public class AuthController : ControllerBase {

        private readonly AppDbContext db;
        private readonly TokenSettings settings;
        private readonly UserManager<AppUser> userManager;

        public AuthController(AppDbContext db, IOptions<TokenSettings> settings, UserManager<AppUser> userManager) {
            this.db = db;
            this.settings = settings.Value;
            this.userManager = userManager;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Auth([FromBody] TokenRequest model) {
            switch (model.GrantType) {
                case "password":
                    return await GenerateNewToken(model);
                case "refresh_token":
                    return await RefreshToken(model);
                default:
                    return StatusCode(401, new {
                        response = ApiMessages.AuthenticationFailed()
                    });
            }
        }

        [HttpPost("[action]")]
        public IActionResult Logout([FromBody] User user) {
            var tokens = db.Tokens.Where(x => x.UserId == user.UserId).ToList();
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
            if (user != null && user.IsActive && await userManager.CheckPasswordAsync(user, model.Password)) {
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
                    token = response.token,
                    expiration = response.expiration,
                    refresh_token = response.refresh_token,
                    roles = response.roles,
                    userId = response.userId,
                    displayname = response.displayname,
                    customerId = response.customerId
                });
            }
            return StatusCode(401, new {
                response = ApiMessages.AuthenticationFailed()
            });
        }

        private Token CreateRefreshToken(string clientId, string userId) {
            return new Token() {
                ClientId = clientId,
                UserId = userId,
                Value = Guid.NewGuid().ToString("N"),
                CreatedDate = DateTime.UtcNow,
                ExpiryTime = DateTime.UtcNow.AddMinutes(90)
            };
        }

        private async Task<TokenResponse> CreateAccessToken(AppUser user, string refreshToken) {
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
                token = encodedToken,
                expiration = newtoken.ValidTo,
                refresh_token = refreshToken,
                roles = roles.FirstOrDefault(),
                userId = user.Id,
                displayname = user.DisplayName,
                customerId = user.CustomerId
            };
        }

        private async Task<IActionResult> RefreshToken(TokenRequest model) {
            try {
                var refreshToken = db.Tokens.FirstOrDefault(t => t.ClientId == settings.ClientId && t.Value == model.RefreshToken.ToString());
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