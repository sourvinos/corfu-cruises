using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Cases {

    public class InactiveUsersCanNotLogin : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Inactive_Simple_Users_Can_Not_Login();
            yield return Inactive_Admins_Can_Not_Login();
        }

        private static object[] Inactive_Simple_Users_Can_Not_Login() {
            return new object[] {
                new Login {
                    Username = "marios",
                    Password = "2b24a7368e19",
                }
            };
        }

        private static object[] Inactive_Admins_Can_Not_Login() {
            return new object[] {
                new Login {
                    Username = "nikoleta",
                    Password = "8dd193508e05"
                }
            };
        }

    }

}
