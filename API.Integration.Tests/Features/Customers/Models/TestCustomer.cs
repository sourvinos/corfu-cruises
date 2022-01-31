using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Customers {

    public class TestCustomer : ITestEntity {

        public int Id { get; set; }
        public string Description { get; set; }

    }

}