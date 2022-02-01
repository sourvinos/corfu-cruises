using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Registrars {

    public class UpdateInvalidRegistrar : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Ship_Must_Exist();
            yield return Ship_Must_Be_Active();
        }

        private static object[] Ship_Must_Exist() {
            return new object[] {
                new TestRegistrar {
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
                    StatusCode = 450,
                    Id = 1,
                    ShipId = 2,
                    Fullname = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
