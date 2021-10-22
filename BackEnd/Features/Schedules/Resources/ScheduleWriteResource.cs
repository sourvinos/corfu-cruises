namespace BlueWaterCruises.Features.Schedules {

    public class ScheduleWriteResource {

        public int Id { get; set; }
        public string Date { get; set; }
        public int DestinationId { get; set; }
        public int PortId { get; set; }
        public int MaxPersons { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}