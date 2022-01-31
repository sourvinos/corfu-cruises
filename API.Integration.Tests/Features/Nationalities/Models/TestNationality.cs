using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Nationalities {

    public class TestNationality:ITestEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Code { get; set; }

    }

}