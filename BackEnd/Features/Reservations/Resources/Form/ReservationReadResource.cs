using System;
using System.Collections.Generic;
using BlueWaterCruises.Features.PickupPoints;

namespace BlueWaterCruises.Features.Reservations {

    public class ReservationReadResource {

        public string ReservationId { get; set; }

        public string Date { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string TicketNo { get; set; }
        public string Email { get; set; }
        public string Phones { get; set; }
        public string Remarks { get; set; }

        public SimpleResource Customer { get; set; }
        public SimpleResource Destination { get; set; }
        public PickupPointWithPortDropdownResource PickupPoint { get; set; }
        public SimpleResource Driver { get; set; }
        public SimpleResource Ship { get; set; }
        public SimpleResource Port { get; set; }

        public UserResource User { get; set; }

        public List<PassengerReadResource> Passengers { get; set; }

    }

}