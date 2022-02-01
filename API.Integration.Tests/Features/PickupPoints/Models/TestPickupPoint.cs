using API.Integration.Tests.Infrastructure;

namespace API.IntegrationTests.PickupPoints {

    public class TestPickupPoint : ITestEntity {

        public int StatusCode { get; set; }

        public int Id { get; set; }
        public string Description { get; set; }
        public int RouteId { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public string Coordinates { get; set; }

    }

}