using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Ports {

    public class PortListResource : SimpleResource {

        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }

    }

}