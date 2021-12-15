using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Routes {

    public class RouteReadResource {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public bool IsTransfer { get; set; }
        public bool IsActive { get; set; }
        public SimpleResource Port { get; set; }

    }

}