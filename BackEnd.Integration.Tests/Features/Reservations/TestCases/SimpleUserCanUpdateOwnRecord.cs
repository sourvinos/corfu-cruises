using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Reservations {

    public class SimpleUserCanUpdateOwnRecord : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Simple_Users_Can_Update_Own_Records();
        }

        private static object[] Simple_Users_Can_Update_Own_Records() {
            return new object[] {
                new Reservation {
                    FeatureUrl = "/reservations/",
                    ReservationId = "5ca60aad-dc06-46ca-8689-9021d1595741",
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