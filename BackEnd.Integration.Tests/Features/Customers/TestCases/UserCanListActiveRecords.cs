using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests {

    public class UsersCanListActiveRecords : IEnumerable<object[]> {

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
                    UserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828"
                }
            };
        }

        private static object[] Admins_Can_List_Active_Records() {
            return new object[] {
                new Login {
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da"
                }
            };
        }

    }

}
