using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Schedules {

    public class UpdateTestSchedule : ITestEntity {

        public int StatusCode { get; set; }

        public int Id { get; set; }
        public int DestinationId { get; set; }
        public int PortId { get; set; }
        public string Date { get; set; }
        public int MaxPersons { get; set; }

    }

}