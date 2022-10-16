using API.Infrastructure.Classes;

namespace API.Features.Schedules {

    public class ScheduleWriteDto : BaseEntity {

        public int Id { get; set; }
        public int DestinationId { get; set; }
        public int PortId { get; set; }
        public string Date { get; set; }
        public int MaxPax { get; set; }
        public string DepartureTime { get; set; }
        public bool IsActive { get; set; }
 
    }

}