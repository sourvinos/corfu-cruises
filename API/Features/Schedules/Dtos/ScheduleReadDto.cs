using API.Infrastructure.Classes;

namespace API.Features.Schedules {

    public class ScheduleReadDto {

        public int Id { get; set; }
        public string Date { get; set; }
        public SimpleResource Destination { get; set; }
        public SimpleResource Port { get; set; }
        public int MaxPassengers { get; set; }
        public string DepartureTime { get; set; }
        public bool IsActive { get; set; }

    }

}