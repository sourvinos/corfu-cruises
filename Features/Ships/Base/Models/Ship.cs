using System.Collections.Generic;

namespace CorfuCruises {

    public class Ship {

        public int Id { get; set; }
        public int ShipOwnerId { get; set; }
        public string Description { get; set; }
        public string IMO { get; set; }
        public string Flag { get; set; }
        public string RegistryNo { get; set; }
        public string Manager { get; set; }
        public string ManagerInGreece { get; set; }
        public string Agent { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public ShipOwner ShipOwner { get; set; }

        public IEnumerable<Registrar> Registrars { get; set; }

    }

}