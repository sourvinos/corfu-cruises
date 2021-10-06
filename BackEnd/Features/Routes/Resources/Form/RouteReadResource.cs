namespace BlueWaterCruises.Features.Routes {

    public class RouteReadResource : SimpleResource {

        public string Abbreviation { get; set; }
        public bool IsTransfer { get; set; }
        public bool IsActive { get; set; }

        public SimpleResource Port { get; set; }

    }

}