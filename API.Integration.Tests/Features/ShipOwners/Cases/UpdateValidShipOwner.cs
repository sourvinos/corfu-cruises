using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.ShipOwners {

    public class UpdateValidShipOwner : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestOwner {
                    FeatureUrl = "/shipOwners/1",
                    Id = 1,
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
