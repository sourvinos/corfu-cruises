using System.Collections.Generic;
using BlueWaterCruises.Features.Customers;
using BlueWaterCruises.Features.Destinations;
using BlueWaterCruises.Features.Drivers;
using BlueWaterCruises.Features.Genders;
using BlueWaterCruises.Features.Nationalities;
using BlueWaterCruises.Features.Occupants;
using BlueWaterCruises.Features.PickupPoints;
using BlueWaterCruises.Features.Ports;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Features.Routes;
using BlueWaterCruises.Features.Schedules;
using BlueWaterCruises.Features.Ships.Base;
using BlueWaterCruises.Features.Ships.Crews;
using BlueWaterCruises.Features.Ships.Owners;
using BlueWaterCruises.Features.Ships.Registrars;
using BlueWaterCruises.Features.Ships.Routes;
using BlueWaterCruises.Infrastructure.Auth;
using Microsoft.AspNetCore.Identity;

namespace BlueWaterCruises.Infrastructure.Identity {

    public class UserExtended : IdentityUser {

        // Fields
        public string DisplayName { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public int CustomerId { get; set; }
        // Navigation
        public List<Crew> Crews { get; set; }
        public List<Customer> Customers { get; set; }
        public List<Destination> Destinations { get; set; }
        public List<Driver> Drivers { get; set; }
        public List<Gender> Genders { get; set; }
        public List<Nationality> Nationalities { get; set; }
        public List<Occupant> Occupants { get; set; }
        public List<Passenger> Passengers { get; set; }
        public List<PickupPoint> PickupPoints { get; set; }
        public List<Port> Ports { get; set; }
        public List<Registrar> Registrars { get; set; }
        public List<Reservation> Reservations { get; set; }
        public List<Route> Routes { get; set; }
        public List<Schedule> Schedules { get; set; }
        public List<Ship> Ships { get; set; }
        public List<ShipOwner> ShipOwners { get; set; }
        public List<ShipRoute> ShipRoutes { get; set; }
        public List<Token> Tokens { get; set; }

    }

}