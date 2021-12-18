using System.Collections;
using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace BackEnd.IntegrationTests.Reservations {

    public class NewReservationsWithoutErrors : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Admins_Can_Create_Reservations();
            // yield return Simple_Users_Can_Create_Reservations();
        }

        private static object[] Admins_Can_Create_Reservations() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    CustomerId = 1,
                    DestinationId = 1,
                    DriverId = 1 ,
                    PickuPointId = 1,
                    PortId = 2,
                    ShipId = 1,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 3,
                    Kids = 1,
                    Free = 1,
                    Email = "",
                    Phones = "",
                    Remarks = "",
                    Passengers = new List<Passenger>()
                }
            };
        }

    }

}
