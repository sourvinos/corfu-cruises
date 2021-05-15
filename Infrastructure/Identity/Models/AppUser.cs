using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace CorfuCruises {

    public class AppUser : IdentityUser {

        public string DisplayName { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsFirstLogin { get; set; }
        public string OneTimePassword { get; set; }
        public bool IsOneTimePasswordChanged { get; set; }
        public bool IsActive { get; set; }
        public int CustomerId { get; set; }

        public virtual List<Token> Tokens { get; set; }
    }

}