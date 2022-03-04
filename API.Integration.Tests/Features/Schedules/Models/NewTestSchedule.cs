using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Schedules {

    public class NewTestSchedule : ITestEntity {

        public int StatusCode { get; set; }

        public int Id { get; set; }
        public List<TestScheduleBody> TestScheduleBody { get; set; }

    }

    public class TestScheduleBody {

        public int Id { get; set; }
        public int DestinationId { get; set; }
        public int PortId { get; set; }
        public string Date { get; set; }
        public int MaxPassengers { get; set; }

    }

}