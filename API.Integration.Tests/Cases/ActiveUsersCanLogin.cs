using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Cases {

    public class ActiveUsersCanLogin : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Active_Simple_Users_Can_Login();
            yield return Active_Admins_Can_Login();
        }

        private static object[] Active_Simple_Users_Can_Login() {
            return new object[] {
                new Login {
                    Username = "simpleuser",
                    Password = "1234567890"
                }
            };
        }

        private static object[] Active_Admins_Can_Login() {
            return new object[] {
                new Login {
                    Username = "john",
                    Password = "ec11fc8c16da"
                }
            };
        }

    }

}
