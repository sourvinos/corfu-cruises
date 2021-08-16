using System;
using System.Collections.Generic;
using BlueWaterCruises.Features.Customers;
using BlueWaterCruises.Features.Destinations;
using BlueWaterCruises.Features.Drivers;
using BlueWaterCruises.Features.PickupPoints;
using BlueWaterCruises.Features.Ports;

namespace BlueWaterCruises.Features.Reservations {

    public class ReservationReadResource {

        public Guid ReservationId { get; set; }

        public string Date { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string TicketNo { get; set; }
        public string Email { get; set; }
        public string Phones { get; set; }
        public string Remarks { get; set; }

        public CustomerDropdownResource Customer { get; set; }
        public DestinationDropdownResource Destination { get; set; }
        public PickupPointDropdownResource PickupPoint { get; set; }
        public DriverDropdownResource Driver { get; set; }
        public ShipDropdownResource Ship { get; set; }
        public PortDropdownResource Port { get; set; }

        public UserResource User { get; set; }

        public List<PassengerReadResource> Passengers { get; set; }

    }

}