using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.ShipOwners {

    public class CreateValidShipOwner : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestOwner {
                    FeatureUrl = "/shipOwners/",
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
