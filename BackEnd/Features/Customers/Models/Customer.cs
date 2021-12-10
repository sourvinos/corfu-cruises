﻿using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace BlueWaterCruises.Features.Customers {

    public class Customer : SimpleResource {

        public string Profession { get; set; }
        public string Address { get; set; }
        public string Phones { get; set; }
        public string PersonInCharge { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public AppUser User { get; set; }

        public List<Reservation> Reservations { get; set; }

    }

}