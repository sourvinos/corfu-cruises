using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Routes {

    public class RouteWriteResource : SimpleResource {

        public int PortId { get; set; }
        public string Abbreviation { get; set; }
        public bool IsTransfer { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}
