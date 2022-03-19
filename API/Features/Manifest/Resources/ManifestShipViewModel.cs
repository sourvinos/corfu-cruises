using System.Collections.Generic;

namespace API.Features.Manifest {

    public class ManifestShipViewModel {

        public string Description { get; set; }
        public string IMO { get; set; }
        public string Flag { get; set; }
        public string RegistryNo { get; set; }
        public string Manager { get; set; }
        public string ManagerInGreece { get; set; }
        public string Agent { get; set; }

        public ManifestShipOwnerViewModel ShipOwner { get; set; }
        public List<ManifestRegistrarViewModel> Registrars { get; set; }
        public List<ManifestCrewViewModel> Crew { get; set; }

    }

}