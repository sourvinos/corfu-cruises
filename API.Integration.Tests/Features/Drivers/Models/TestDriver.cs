using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Drivers {

    public class TestDriver : ITestEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public string LastUpdate { get; set; }
        
    }

}