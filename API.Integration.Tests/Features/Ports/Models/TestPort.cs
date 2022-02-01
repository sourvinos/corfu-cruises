using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Ports {

    public class TestPort : ITestEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public bool IsPrimary { get; set; }

    }

}