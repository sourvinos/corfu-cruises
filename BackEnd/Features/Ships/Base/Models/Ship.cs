using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Features.Ships.Crews;
using BlueWaterCruises.Features.Ships.Owners;
using BlueWaterCruises.Features.Ships.Registrars;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Ships.Base {

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