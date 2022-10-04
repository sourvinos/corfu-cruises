namespace API.Features.Schedules {

    public class ScheduleListVM {

        public int Id { get; set; }
        public string Date { get; set; }
        public string DestinationDescription { get; set; }
        public string PortDescription { get; set; }
        public int MaxPax { get; set; }
        public bool IsActive { get; set; }

    }

}