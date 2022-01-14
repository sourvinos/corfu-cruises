using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.ShipsCrews {

    public class NewMinimalCrew : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return CreateMinimalRecord();
        }

        private static object[] CreateMinimalRecord() {
            return new object[] {
                new TestCrew {
                    FeatureUrl = "/crews/",
                    GenderId = 1,
                    NationalityId = 1,
                    ShipId = 1,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01",
                }
            };
        }

    }

}
