namespace API.Features.Availability {

    public class ScheduleViewModel {

        public string Date { get; set; }
        public int DestinationId { get; set; }
        public string DestinationDescription { get; set; }
        public string DestinationAbbreviation { get; set; }
        public int PortId { get; set; }
        public string PortDescription { get; set; }
        public bool IsPortPrimary { get; set; }
        public int MaxPassengers { get; set; }
        public int Passengers { get; set; }

    }

}