using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Schedules {

    public class ScheduleReadResource {

        public int Id { get; set; }
        public string Date { get; set; }
        public SimpleResource Destination { get; set; }
        public SimpleResource Port { get; set; }
        public int MaxPersons { get; set; }
        public bool IsActive { get; set; }

    }

}