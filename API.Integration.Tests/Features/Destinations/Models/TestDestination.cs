using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Destinations {

    public class TestDestination : ITestEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }

    }

}