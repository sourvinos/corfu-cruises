using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests {

    public class SimpleUserCanNotUpdateNotOwnedRecord : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Simple_Users_Can_Not_Update_Not_Owned_Records();
        }

        private static object[] Simple_Users_Can_Not_Update_Not_Owned_Records() {
            return new object[] {
                new Reservation {
                    FeatureUrl = "/reservations/",
                    ReservationId = "38895436-1c25-4d0b-bc31-cac6a20d523e",
                    Username = "matoula",
                    Password = "820343d9e828",
                    UserId = "4fcd7909-0569-45d9-8b78-2b24a7368e19",
                    ExpectedResponseCode = 401,
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