using System;

namespace BlueWaterCruises.Infrastructure.Auth {

    public class TokenResponse {

        // FKs
        public int CustomerId { get; set; }
        public string UserId { get; set; }
        // Fields
        public DateTime Expiration { get; set; }
        public string Displayname { get; set; }
        public string RefreshToken { get; set; }
        public string Roles { get; set; }
        public string Token { get; set; }

    }

}