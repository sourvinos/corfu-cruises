using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Routes {

    public class CreateInvalidRoute : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Port_Must_Exist();
            yield return Port_Must_Be_Active();
        }

        private static object[] Port_Must_Exist() {
            return new object[] {
                new TestRoute {
                    StatusCode = 450,
                    PortId = 99,
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation = Helpers.CreateRandomString(10)
                }
            };
        }

        private static object[] Port_Must_Be_Active() {
            return new object[] {
                new TestRoute {
                    StatusCode = 450,
                    PortId = 3,
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation = Helpers.CreateRandomString(10)
                }
            };
        }

    }

}