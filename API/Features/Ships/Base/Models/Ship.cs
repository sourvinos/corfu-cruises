using System.Collections.Generic;
using API.Features.Reservations;
using API.Features.Ships.Crews;
using API.Features.Ships.Owners;
using API.Features.Ships.Registrars;
using API.Infrastructure.Identity;

namespace API.Features.Ships.Base {

    public class Ship {

        // PK
        public int Id { get; set; }
        // FKs
        public int ShipOwnerId { get; set; }
        // Fields
        public string Description { get; set; }
        public string IMO { get; set; }
        public string Flag { get; set; }
        public string RegistryNo { get; set; }
        public string Manager { get; set; }
        public string ManagerInGreece { get; set; }
        public string Agent { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public ShipOwner ShipOwner { get; set; }
        public UserExtended User { get; set; }
        public List<Crew> Crews { get; set; }
        public List<Registrar> Registrars { get; set; }
        public List<Reservation> Reservations { get; set; }

    }

}