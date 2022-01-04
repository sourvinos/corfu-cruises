using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Reservations {

    public class SimpleUsersCanNotCreateRecordsWhenInvalid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Simple_Users_Can_Not_Create_Records_In_Past_Date();
        }

        private static object[] Simple_Users_Can_Not_Create_Records_In_Past_Date() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 431,
                    Date = "2021-10-04",
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 1,
                    TicketNo = "xxxx"
                }
            };
        }

    }

}
