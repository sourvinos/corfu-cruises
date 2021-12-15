using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Features.Routes;
using BlueWaterCruises.Features.Schedules;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Ports {

    public class Port {

        // PK
        public int Id { get; set; }
        // Fields
        public string Description { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public UserExtended User { get; set; }
        public List<Reservation> Reservations { get; set; }
        public List<Route> Routes { get; set; }
        public List<Schedule> Schedules { get; set; }

    }

}