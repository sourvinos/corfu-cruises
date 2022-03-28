namespace API.Features.Schedules {

    public class ScheduleWriteDto {

        public int Id { get; set; }
        public int DestinationId { get; set; }
        public int PortId { get; set; }
        public string Date { get; set; }
        public int MaxPassengers { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}