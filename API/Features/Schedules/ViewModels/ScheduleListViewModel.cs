namespace API.Features.Schedules {

    public class ScheduleListViewModel {

        public int Id { get; set; }
        public string Date { get; set; }
        public string DestinationDescription { get; set; }
        public string PortDescription { get; set; }
        public int MaxPassengers { get; set; }
        public bool IsActive { get; set; }

    }

}