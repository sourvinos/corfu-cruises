using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Features.Routes;

namespace BlueWaterCruises.Features.PickupPoints {

    public class PickupPoint : SimpleResource {

        public int RouteId { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public string Coordinates { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public AppUser User { get; set; }
        public Route Route { get; set; }

        public List<Reservation> Reservations { get; set; }

    }

}