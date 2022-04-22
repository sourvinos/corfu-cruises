namespace API.Features.Availability {

    public class PortVM {

        public int Id { get; set; }
        public string Description { get; set; }
        public int MaxPassengers { get; set; }
        public bool IsPrimary { get; set; }
        public int PassengerCount { get; set; }
        public int AvailableSeats { get; set; }

    }

}