using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace BlueWaterCruises.Features.Nationalities {

    public class Nationality : SimpleResource {

        public string Code { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public AppUser User { get; set; }

        public List<Passenger> Passengers { get; set; }

    }

}