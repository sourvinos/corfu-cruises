using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Occupants {

    public class Occupant : SimpleResource {

        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public List<Passenger> Passengers { get; set; }

        public AppUser User { get; set; }

    }

}