using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Routes {

    public class RouteListResource : SimpleResource {

        public string Abbreviation { get; set; }
        public bool IsTransfer { get; set; }
        public bool IsActive { get; set; }

    }

}