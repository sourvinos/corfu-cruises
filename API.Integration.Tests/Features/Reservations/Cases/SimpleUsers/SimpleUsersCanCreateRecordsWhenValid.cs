using System.Collections;
using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace API.IntegrationTests.Reservations {

    public class SimpleUsersCanCreateRecordsWhenValid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Simple_Users_Can_Create_Records_In_Future_Date();
        }

        private static object[] Simple_Users_Can_Create_Records_In_Future_Date() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    Date = "2025-01-01",
                    TicketNo = "xxxx",
                    Adults = 3,
                    Passengers = new List<Passenger>()
                }
            };
        }

    }

}