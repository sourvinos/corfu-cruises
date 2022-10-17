using System.Collections.Generic;

namespace API.Features.Manifest {

    public class ManifestFinalShipVM {

        // Level 2a of 3

        public string Description { get; set; }
        public string IMO { get; set; }
        public string Flag { get; set; }
        public string RegistryNo { get; set; }
        public string Manager { get; set; }
        public string ManagerInGreece { get; set; }
        public string Agent { get; set; }

        public ManifestFinalShipOwnerVM ShipOwner { get; set; } // Level 3a of 3
        public List<ManifestFinalRegistrarVM> Registrars { get; set; } // Level 3b of 3
        public List<ManifestFinalCrewVM> Crew { get; set; } // Level 3c of 3

    }

}