using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Features.Schedules;

namespace BlueWaterCruises.Features.Ports {

    public class Port : SimpleResource {

        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public AppUser User { get; set; }

        public List<Schedule> Schedules { get; set; }
        public List<Reservation> Reservations { get; set; }

    }

}