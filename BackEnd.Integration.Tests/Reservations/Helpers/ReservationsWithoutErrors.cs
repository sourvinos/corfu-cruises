using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests {

    public class ReservationsWithoutErrors : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return this.Logged_In_Simple_Users_Can_Create_Reservations();
            yield return this.Logged_In_Administrators_Can_Create_Reservations();
        }

        private object[] Logged_In_Simple_Users_Can_Create_Reservations() {
            return new object[] {
                new ReservationTest {
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

        private object[] Logged_In_Administrators_Can_Create_Reservations() {
            return new object[] {
                new ReservationTest {
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
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
