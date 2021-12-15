using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Features.Ships.Crews;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Genders {

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