using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace ShipCruises {

    public class AppUser : IdentityUser {

        public string DisplayName { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsActive { get; set; }
        public int CustomerId { get; set; }

        public Customer Customer { get; set; }

        public List<Token> Tokens { get; set; }
        
    }

}