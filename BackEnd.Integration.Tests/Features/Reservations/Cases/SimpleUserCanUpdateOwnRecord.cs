using System;
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
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    ReservationId = Guid.Parse("d32c6c0f-25b8-42fe-a6ad-9c1f913931c6"),
                    CustomerId = 3,
                    DestinationId = 1,
                    DriverId = 10,
                    PickuPointId = 82,
                    PortId = 1,
                    ShipId = 1,
                    Date = "2021-10-10",
                    TicketNo = "NIOMS",
                    Adults = 1,
                    Kids = 1,
                    Free = 1,
                    Email = "PEARL53@YAHOO.COM",
                    Phones = "602-793-7631",
                    Remarks = "",
                    UserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828"
                }
            };
        }

    }

}