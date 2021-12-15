using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Features.Ships.Crews;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Genders {

    public class Gender : SimpleResource {

        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public List<Crew> Crews { get; set; }
        public List<Passenger> Passengers { get; set; }

        public AppUser User { get; set; }

    }

}