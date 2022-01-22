using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Infrastructure {

    public class ActiveUsersCanLogin : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Active_Simple_Users_Can_Login();
            yield return Active_Admins_Can_Login();
        }

        private static object[] Active_Simple_Users_Can_Login() {
            return new object[] {
                new Login {
                    Username = "matoula",
                    Password = "820343d9e828",
                    StatusCode = 403
                }
            };
        }

        private static object[] Active_Admins_Can_Login() {
            return new object[] {
                new Login {
                    Username = "john",
                    Password = "ec11fc8c16da",
                    StatusCode = 404
                }
            };
        }

    }

}
