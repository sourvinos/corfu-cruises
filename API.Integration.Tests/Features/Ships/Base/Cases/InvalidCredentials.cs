using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Ships.Base {

    public class InvalidCredentials : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestShip {
                    FeatureUrl = "/ships/"
                }
            };
        }

    }

}
