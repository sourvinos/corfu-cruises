namespace BlueWaterCruises.Features.Schedules {

    public class PortResource : SimpleResource {

        public string Abbreviation { get; set; }
        public int Max { get; set; }
        public bool IsPrimary { get; set; }
        public int Reservations { get; set; }
        public int Empty { get; set; }

    }

}