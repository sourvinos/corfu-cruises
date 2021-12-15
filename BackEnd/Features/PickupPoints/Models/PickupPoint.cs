using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Features.Routes;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.PickupPoints {

    public class PickupPoint {

        // PK
        public int Id { get; set; }
        // Fields
        public string Description { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public string Coordinates { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public int RouteId { get; set; }
        public string UserId { get; set; }
        // Navigation
        public Route Route { get; set; }
        public UserExtended User { get; set; }
        public List<Reservation> Reservations { get; set; }

    }

}