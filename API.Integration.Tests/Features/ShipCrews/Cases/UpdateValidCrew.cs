using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.IntegrationTests.ShipCrews {

    public class UpdateValidCrew : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestCrew {
                    Id = 21,
                    GenderId = 1,
                    NationalityId = 1,
                    OccupantId = 1,
                    ShipId = 6,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01"
                }
            };
        }

    }

}
