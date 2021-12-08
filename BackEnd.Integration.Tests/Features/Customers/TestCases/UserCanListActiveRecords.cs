using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests {

    public class UserCanListActiveRecords : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return this.Simple_User_Can_List_Active_Records();
            yield return this.Admin_Can_List_Active_Records();
        }

        private object[] Simple_User_Can_List_Active_Records() {
            return new object[] {
                new Login {
                    Username = "matoula",
                    Password = "820343d9e828",
                    UserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828"
                }
            };
        }

        private object[] Admin_Can_List_Active_Records() {
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
