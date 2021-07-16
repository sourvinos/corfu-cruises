using System;
using System.Collections.Generic;

namespace ShipCruises {

    public class WebWriteResource {

        public Guid ReservationId { get; set; }
        public string Date { get; set; }
        public int DestinationId { get; set; }
        public int PickupPointId { get; set; }
        public int PortId { get; set; }
        public string Email { get; set; }
        public string Phones { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public string Remarks { get; set; }

        public List<PassengerWriteResource> Passengers { get; set; }

    }

}