using System;

namespace API.Infrastructure.Auth {

    public class TokenResponse {

        public string UserId { get; set; }
        public bool IsAdmin { get; set; }
        public string Displayname { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public DateTime Expiration { get; set; }

    }

}