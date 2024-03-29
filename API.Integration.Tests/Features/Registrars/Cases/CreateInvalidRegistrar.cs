using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Registrars {

    public class CreateInvalidRegistrar : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Ship_Must_Exist();
            yield return Ship_Must_Be_Active();
        }

        private static object[] Ship_Must_Exist() {
            return new object[] {
                new TestRegistrar {
                    StatusCode = 450,
                    ShipId = 99,
                    Fullname = Helpers.CreateRandomString(128)
                }
            };
        }

        private static object[] Ship_Must_Be_Active() {
            return new object[] {
                new TestRegistrar {
                    StatusCode = 450,
                    ShipId = 8,
                    Fullname = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
