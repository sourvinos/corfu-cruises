using System;

namespace API.Infrastructure.Auth {

    public class TokenResponse {

        // PK
        public string UserId { get; set; }
        // Fields
        public bool IsAdmin { get; set; }
        public string Displayname { get; set; }
        // FKs
        public int? CustomerId { get; set; }
        // Calculated
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public DateTime Expiration { get; set; }

    }

}