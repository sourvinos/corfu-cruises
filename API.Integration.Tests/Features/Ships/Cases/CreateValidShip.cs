using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.Ships {

    public class CreateValidShip : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestShip {
                    FeatureUrl = "/ships/",
                    ShipOwnerId = 1,
                    Description = Helpers.CreateRandomString(5),
                }
            };
        }

    }

}
