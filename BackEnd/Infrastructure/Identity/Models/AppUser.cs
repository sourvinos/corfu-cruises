using System.Collections.Generic;
using BlueWaterCruises.Features.Customers;
using Microsoft.AspNetCore.Identity;

namespace BlueWaterCruises {

    public class AppUser : IdentityUser {

        public string DisplayName { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsActive { get; set; }
        public int CustomerId { get; set; }

        public Customer Customer { get; set; }

        public List<Token> Tokens { get; set; }
        
    }

}