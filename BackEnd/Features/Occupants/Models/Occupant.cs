using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace BlueWaterCruises.Features.Occupants {

    public class Occupant : SimpleResource {

        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public AppUser User { get; set; }

        public List<Passenger> Passengers { get; set; }

    }

}