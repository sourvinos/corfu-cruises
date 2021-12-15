using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Drivers {

    public class Driver {

        // PK
        public int Id { get; set; }
        // Fields
        public string Description { get; set; }
        public string Phones { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public UserExtended User { get; set; }
        public List<Reservation> Reservations { get; set; }

    }

}