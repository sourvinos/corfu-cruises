using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Customers {

    public class UsersCanGetActiveForDropdown : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Simple_Users_Can_List_Active_Records();
            yield return Admins_Can_List_Active_Records();
        }

        private static object[] Simple_Users_Can_List_Active_Records() {
            return new object[] {
                new Login {
                    Username = "matoula",
                    Password = "820343d9e828",
                }
            };
        }

        private static object[] Admins_Can_List_Active_Records() {
            return new object[] {
                new Login {
                    Username = "john",
                    Password = "ec11fc8c16da"
                }
            };
        }

    }

}
