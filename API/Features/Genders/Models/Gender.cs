using System.Collections.Generic;
using API.Features.Reservations;
using API.Features.Ships.Crews;
using API.Infrastructure.Identity;

namespace API.Features.Genders {

    public class Gender {

        // PK
        public int Id { get; set; }
        // Fields
        public string Description { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public UserExtended User { get; set; }
        public List<Crew> Crews { get; set; }
        public List<Passenger> Passengers { get; set; }

    }

}