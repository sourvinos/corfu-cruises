using System;

namespace BlueWaterCruises {

    public class TokenResponse {

        public string Token { get; set; }
        public DateTime Expiration { get; set; }
        public string Refresh_token { get; set; }
        public string Roles { get; set; }
        public string UserId { get; set; }
        public string Displayname { get; set; }
        public int CustomerId { get; set; }

    }

}