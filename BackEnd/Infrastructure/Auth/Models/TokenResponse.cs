using System;

namespace BlueWaterCruises {

    public class TokenResponse {

        public string token { get; set; }
        public DateTime expiration { get; set; }
        public string refresh_token { get; set; }
        public string roles { get; set; }
        public string userId { get; set; }
        public string displayName { get; set; }
        public int CustomerId { get; set; }

    }

}