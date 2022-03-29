using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.CoachRoutes {

    public class TestCoachRoute : ITestEntity {

        public int StatusCode { get; set; }

        public int Id { get; set; }
        public int PortId { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }

    }

}