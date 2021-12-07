using System;
using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests {

    // https://stackoverflow.com/questions/22093843/pass-complex-parameters-to-theory

    public class SimpleUsersCanNotUpdateRecordsOwnedByOtherUsers : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return this.Simple_Users_Can_Not_Update_Records_Owned_By_Other_Users();
        }

        private object[] Simple_Users_Can_Not_Update_Records_Owned_By_Other_Users() {
            return new object[] {
                new ReservationTest {
                    ReservationId = Guid.Parse("38895436-1c25-4d0b-bc31-cac6a20d523e"),
                    Username = "matoula",
                    Password = "820343d9e828",
                    UserId = "4fcd7909-0569-45d9-8b78-2b24a7368e19",
                    ExpectedError = 401,
                    Date = "2021-10-01",
                    DestinationId = 1,
                    CustomerId = 1,
                    PortId = 1,
                    Adults = 3,
                    TicketNo = "xxxx"
                }
            };
        }

    }

}