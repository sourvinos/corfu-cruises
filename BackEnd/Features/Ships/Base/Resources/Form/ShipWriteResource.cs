using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Ships.Base {

    public class ShipWriteResource : SimpleResource {

        public int ShipOwnerId { get; set; }
        public string IMO { get; set; }
        public string Flag { get; set; }
        public string RegistryNo { get; set; }
        public string Manager { get; set; }
        public string ManagerInGreece { get; set; }
        public string Agent { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}