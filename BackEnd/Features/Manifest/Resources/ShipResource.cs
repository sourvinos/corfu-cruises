using System.Collections.Generic;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Manifest {

    public class ShipResource : SimpleResource {

        public string IMO { get; set; }
        public string Flag { get; set; }
        public string RegistryNo { get; set; }
        public string Manager { get; set; }
        public string ManagerInGreece { get; set; }
        public string Agent { get; set; }

        public ShipOwnerResource ShipOwner { get; set; }
        public List<RegistrarResource> Registrars { get; set; }
        public List<ManifestCrewResource> Crew { get; set; }

    }

}