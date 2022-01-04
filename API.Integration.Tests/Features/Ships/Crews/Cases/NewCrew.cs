using API.IntegrationTests.Infrastructure;
using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Ships.Crews {

    public class NewCrew : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestCrew {
                    FeatureUrl = "/crews/",
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01",
                    ShipId = 1,
                    NationalityId = 1,
                    GenderId = 1,
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da"
                }
            };
        }

    }

}
