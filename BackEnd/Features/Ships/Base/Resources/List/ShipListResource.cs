using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Ships.Base {

    public class ShipListResource : SimpleResource {

        public string OwnerDescription { get; set; }
        public string IMO { get; set; }
        public bool IsActive { get; set; }

    }

}