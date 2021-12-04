using System;
using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests {

    // https://stackoverflow.com/questions/22093843/pass-complex-parameters-to-theory

    public class SimpleUsersCanUpdateTheirOwnRecords : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return this.Simple_Users_Can_Update_Their_Own_Records();
        }

        private object[] Simple_Users_Can_Update_Their_Own_Records() {
            return new object[] {
                new ReservationTest {
                    ReservationId = Guid.Parse("5ca60aad-dc06-46ca-8689-9021d1595741"),
                    Username = "matoula",
                    Password = "820343d9e828",
                    UserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828",
                    ExpectedError = 200,
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