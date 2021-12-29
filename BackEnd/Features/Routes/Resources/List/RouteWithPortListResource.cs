using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Routes {

    public class RouteWithPortListResource {

        public int Id { get; set; }
        public string Abbreviation { get; set; }
        public SimpleResource Port { get; set; }

    }

}