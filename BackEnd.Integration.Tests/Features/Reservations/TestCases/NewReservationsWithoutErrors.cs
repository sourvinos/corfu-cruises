using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests {

    public class NewReservationsWithoutErrors : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Admins_Can_Create_Reservations();
            yield return Simple_Users_Can_Create_Reservations();
        }

        private static object[] Admins_Can_Create_Reservations() {
            return new object[] {
                new Reservation {
                    FeatureUrl = "/reservations/",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ExpectedResponseCode = 200,
                    Date = "2021-10-01",
                    DestinationId = 1,
                    CustomerId = 1,
                    PortId = 1,
                    Adults = 3,
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] Simple_Users_Can_Create_Reservations() {
            return new object[] {
                new Reservation {
                    FeatureUrl = "/reservations/",
                    Username = "matoula",
                    Password = "820343d9e828",
                    UserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828",
                    ExpectedResponseCode = 200,
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
