using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Ships.Crews {

    public class ExistingCrew : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestCrew {
                    FeatureUrl = "/crews/1",
                    Id = 1,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01",
                    ShipId = 1,
                    NationalityId = 1,
                    GenderId = 1
                }
            };
        }

    }

}
