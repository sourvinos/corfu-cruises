using System;

namespace API.Infrastructure.Identity {

    public class TokenVM {

        public string UserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime Now { get; set; }
        public double Duration { get; set; }
        public bool IsLoggedIn { get; set; }

    }


}