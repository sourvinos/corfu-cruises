using System.Collections.Generic;

namespace API.IntegrationTests.Schedules {

    public class TestSchedule {

        public string FeatureUrl { get; set; }
        public int StatusCode { get; set; }

        public List<TestScheduleBody> TestScheduleBody { get; set; }

    }

    public class TestScheduleBody {

        public int Id { get; set; }
        public int DestinationId { get; set; }
        public int PortId { get; set; }
        public string Date { get; set; }
        public int MaxPersons { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}