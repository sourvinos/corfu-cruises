using API.IntegrationTests.Infrastructure;
using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Ships.Base {

    public class NewShip : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestShip {
                    FeatureUrl = "/ships/",
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
