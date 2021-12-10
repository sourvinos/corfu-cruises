using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests {

    public class SimpleUserCanNotDeleteRecord : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Simple_Users_Can_Not_Delete_Records();
        }

        private static  object[] Simple_Users_Can_Not_Delete_Records() {
            return new object[] {
                new ReservationBase {
                    ReservationId = "38895436-1c25-4d0b-bc31-cac6a20d523e",
                    Username = "matoula",
                    Password = "820343d9e828",
                    UserId = "4fcd7909-0569-45d9-8b78-2b24a7368e19",
                    ExpectedResponseCode = 403
                }
            };
        }

    }

}