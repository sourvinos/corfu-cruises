using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Features.Schedules;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Destinations {

    public class Destination {

        // PK
        public int Id { get; set; }
        // Fields
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public AppUser User { get; set; }
        public List<Schedule> Schedules { get; set; }
        public List<Reservation> Reservations { get; set; }

    }

}