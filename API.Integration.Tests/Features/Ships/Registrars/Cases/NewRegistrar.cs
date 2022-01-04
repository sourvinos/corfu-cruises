using API.IntegrationTests.Infrastructure;
using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Ships.Registrars {

    public class NewRegistrar : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestRegistrar {
                    FeatureUrl = "/registrars/",
                    ShipId = 2,
                    Fullname = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
