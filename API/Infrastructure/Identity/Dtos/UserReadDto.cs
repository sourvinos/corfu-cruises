using API.Infrastructure.Classes;

namespace API.Infrastructure.Identity {

    public class UserReadDto {

        public string Id { get; set; }
        public string UserName { get; set; }
        public string Displayname { get; set; }
        public SimpleResource Customer { get; set; }
        public string Email { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsActive { get; set; }

    }

}