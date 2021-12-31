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
                    PickupPointId = 82,
                    Date = "2021-10-10",
                }
            };
        }

    }

}