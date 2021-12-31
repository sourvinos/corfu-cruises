using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Reservations {

    public class NewSimpleUserReservationWithErrors : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Simple_Users_Can_Not_Create_Reservations_In_Past_Date();
        }

        private static object[] Simple_Users_Can_Not_Create_Reservations_In_Past_Date() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 431,
                    Date = "2021-10-04",
                    CustomerId = 1, // SKILES, CUMMERATA AND NICOLAS
                    DestinationId = 1, // PAXOS
                    PickupPointId = 1, // RODA BEACH, RouteId = 5, PortId = 1
                    Adults = 3,
                    TicketNo = "xxxx"
                }
            };
        }

    }

}
