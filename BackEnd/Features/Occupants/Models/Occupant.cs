using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Occupants {

    public class Occupant {

        // PK
        public int Id { get; set; }
        // Fields
        public string Description { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public AppUser User { get; set; }
        public List<Passenger> Passengers { get; set; }

    }

}