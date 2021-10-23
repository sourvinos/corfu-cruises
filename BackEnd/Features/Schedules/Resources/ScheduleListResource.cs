namespace BlueWaterCruises.Features.Schedules {

    public class ScheduleListResource {

        public int Id { get; set; }
        public string Date { get; set; }
        public string DestinationDescription { get; set; }
        public string PortDescription { get; set; }
        public int MaxPersons { get; set; }
        public bool IsActive { get; set; }

    }

}