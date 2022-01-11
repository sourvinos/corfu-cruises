using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.Ships.Crews {

    public class AdminsCantUpdateWhenInvalidCrew : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Ship_Must_Exist();
            yield return Ship_Must_Be_Active();
        }

        private static object[] Ship_Must_Exist() {
            return new object[] {
                new TestCrew {
                    FeatureUrl = "/crews/1",
                    StatusCode = 450,
                    GenderId = 1,
                    NationalityId = 1,
                    ShipId = 4,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01"
                }
            };
        }

        private static object[] Ship_Must_Be_Active() {
            return new object[] {
                new TestCrew {
                    FeatureUrl = "/crews/1",
                    StatusCode = 450,
                    GenderId = 1,
                    NationalityId = 1,
                    ShipId = 4,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01"
                }
            };
        }

    }

}
