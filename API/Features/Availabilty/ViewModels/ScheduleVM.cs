namespace API.Features.Availability {

    public class ScheduleVM {

        public string Date { get; set; }
        public int DestinationId { get; set; }
        public string DestinationDescription { get; set; }
        public string DestinationAbbreviation { get; set; }
        public int PortId { get; set; }
        public string PortAbbreviation { get; set; }
        public int PortStopOrder { get; set; }
        public int MaxPassengers { get; set; }
        public int AccumulatedMaxPassengers { get; set; }
        public int Persons { get; set; }
        public int FreeSeats { get; set; }

    }

}