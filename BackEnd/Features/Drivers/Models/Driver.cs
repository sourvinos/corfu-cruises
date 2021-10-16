using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace BlueWaterCruises.Features.Drivers {

    public class Driver : SimpleResource {

        public string Phones { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public AppUser User { get; set; }

        public List<Reservation> Reservations { get; set; }

    }

}