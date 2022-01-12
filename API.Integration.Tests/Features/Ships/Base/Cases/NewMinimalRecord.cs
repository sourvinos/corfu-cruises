using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.Ships.Base {

    public class NewMinimalRecord : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return CreateMinimalRecord();
        }

        private static object[] CreateMinimalRecord() {
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