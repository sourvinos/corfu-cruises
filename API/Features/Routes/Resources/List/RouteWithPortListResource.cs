using API.Infrastructure.Classes;

namespace API.Features.Routes {

    public class RouteWithPortListResource {

        public int Id { get; set; }
        public string Abbreviation { get; set; }
        public SimpleResource Port { get; set; }

    }

}