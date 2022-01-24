using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.Registrars {

    public class UpdateInvalidRegistrar : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Ship_Must_Exist();
            yield return Ship_Must_Be_Active();
        }

        private static object[] Ship_Must_Exist() {
            return new object[] {
                new TestRegistrar {
                    FeatureUrl = "/registrars/1",
                    StatusCode = 450,
                    Id = 1,
                    ShipId = 4,
                    Fullname = Helpers.CreateRandomString(128)
                }
            };
        }

        private static object[] Ship_Must_Be_Active() {
            return new object[] {
                new TestRegistrar {
                    FeatureUrl = "/registrars/1",
                    StatusCode = 450,
                    Id = 1,
                    ShipId = 2,
                    Fullname = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
