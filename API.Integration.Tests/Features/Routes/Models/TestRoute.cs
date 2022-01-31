using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Routes {

    public class TestRoute : ITestEntity {

        public int StatusCode { get; set; }

        public int Id { get; set; }
        public int PortId { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }

    }

}