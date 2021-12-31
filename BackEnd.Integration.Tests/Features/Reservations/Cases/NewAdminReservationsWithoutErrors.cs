using System.Collections;
using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace BackEnd.IntegrationTests.Reservations {

    public class NewReservationsWithoutErrors : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Admins_Can_Create_Reservations_In_Past_Date();
            yield return Admins_Can_Create_Reservations_In_Future_Date();
        }

        private static object[] Admins_Can_Create_Reservations_In_Past_Date() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 3,
                    Passengers = new List<Passenger>()
                }
            };
        }

        private static object[] Admins_Can_Create_Reservations_In_Future_Date() {
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
