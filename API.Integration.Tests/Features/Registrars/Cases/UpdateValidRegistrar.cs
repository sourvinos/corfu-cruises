using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.Registrars {

    public class UpdateValidRegistrar : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestRegistrar {
                    FeatureUrl = "/registrars/1",
                    Id = 1,
                    ShipId = 1,
                    Fullname = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
