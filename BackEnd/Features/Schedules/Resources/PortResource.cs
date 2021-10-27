namespace BlueWaterCruises.Features.Schedules {

    public class PortResource : SimpleResource {

        public int MaxPassengers { get; set; }
        public bool IsPrimary { get; set; }
        public int PassengerCount { get; set; }
        public int AvailableSeats { get; set; }

    }

}