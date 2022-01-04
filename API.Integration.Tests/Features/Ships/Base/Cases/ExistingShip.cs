using API.IntegrationTests.Infrastructure;
using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Ships.Base {

    public class ExistingShip : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestShip {
                    FeatureUrl = "/ships/1",
                    Id = 1,
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}