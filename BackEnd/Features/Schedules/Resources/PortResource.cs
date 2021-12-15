namespace BlueWaterCruises.Features.Schedules {

    public class PortResource {

        public int Id { get; set; }
        public string Description { get; set; }
        public int MaxPassengers { get; set; }
        public bool IsPrimary { get; set; }
        public int PassengerCount { get; set; }
        public int AvailableSeats { get; set; }

    }

}