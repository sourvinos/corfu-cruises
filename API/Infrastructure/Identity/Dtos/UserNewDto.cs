namespace API.Infrastructure.Identity {

    public class UserNewDto {

        public string UserName { get; set; }
        public string Displayname { get; set; }
        public int? CustomerId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsActive { get; set; }

    }

}