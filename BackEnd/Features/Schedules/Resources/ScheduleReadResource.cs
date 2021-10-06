namespace BlueWaterCruises.Features.Schedules {

    public class ScheduleReadResource {

        public string Date { get; set; }
        public int DestinationId { get; set; }
        public int? PortId { get; set; }
        public int MaxPersons { get; set; }

    }

}