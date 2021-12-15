using System;
using System.Collections.Generic;
using BlueWaterCruises.Features.Customers;
using BlueWaterCruises.Features.Destinations;
using BlueWaterCruises.Features.Drivers;
using BlueWaterCruises.Features.PickupPoints;
using BlueWaterCruises.Features.Ports;
using BlueWaterCruises.Features.Ships.Base;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Reservations {

    public class Reservation {

        // PK
        public Guid ReservationId { get; set; }
        // Fields
        public DateTime Date { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string TicketNo { get; set; }
        public string Email { get; set; }
        public string Phones { get; set; }
        public string Remarks { get; set; }
        // FKs
        public int CustomerId { get; set; }
        public int DestinationId { get; set; }
        public int DriverId { get; set; }
        public int PickupPointId { get; set; }
        public int PortId { get; set; }
        public int ShipId { get; set; }
        public string UserId { get; set; }
        // Navigation
        public Customer Customer { get; set; }
        public Destination Destination { get; set; }
        public Driver Driver { get; set; }
        public PickupPoint PickupPoint { get; set; }
        public Port Port { get; set; }
        public Ship Ship { get; set; }
        public AppUser User { get; set; }
        public List<Passenger> Passengers { get; set; }

    }

}