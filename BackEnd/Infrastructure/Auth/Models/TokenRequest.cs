namespace BlueWaterCruises.Infrastructure.Auth {

    public class TokenRequest {

        public string Username { get; set; }
        public string Password { get; set; }
        public string GrantType { get; set; }
        public string RefreshToken { get; set; }

    }

}