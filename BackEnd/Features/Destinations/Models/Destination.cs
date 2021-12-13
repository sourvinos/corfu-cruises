using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Features.Schedules;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Destinations {

    public class Destination : SimpleResource {

        public string Abbreviation { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public List<Schedule> Schedules { get; set; }
        public List<Reservation> Reservations { get; set; }

        public AppUser User { get; set; }

    }

}