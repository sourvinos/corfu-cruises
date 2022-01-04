﻿using System.Collections.Generic;
using API.Features.Reservations;
using API.Features.Routes;
using API.Infrastructure.Identity;

namespace API.Features.PickupPoints {

    public class PickupPoint {

        // PK
        public int Id { get; set; }
        // FKs
        public int RouteId { get; set; }
        // Fields
        public string Description { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public string Coordinates { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public Route Route { get; set; }
        public UserExtended User { get; set; }
        public List<Reservation> Reservations { get; set; }

    }

}