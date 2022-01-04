using System.Collections.Generic;
using API.Features.Customers;
using API.Features.Destinations;
using API.Features.Drivers;
using API.Features.Genders;
using API.Features.Nationalities;
using API.Features.Occupants;
using API.Features.PickupPoints;
using API.Features.Ports;
using API.Features.Reservations;
using API.Features.Routes;
using API.Features.Schedules;
using API.Features.Ships.Base;
using API.Features.Ships.Crews;
using API.Features.Ships.Owners;
using API.Features.Ships.Registrars;
using API.Features.Ships.Routes;
using API.Infrastructure.Auth;
using Microsoft.AspNetCore.Identity;

namespace API.Infrastructure.Identity {

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