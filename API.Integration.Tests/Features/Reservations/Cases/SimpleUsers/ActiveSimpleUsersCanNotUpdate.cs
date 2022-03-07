using System;
using System.Collections;
using System.Collections.Generic;

namespace API.Integration.Tests.Reservations {

    public class ActiveSimpleUsersCanNotUpdate : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Simple_Users_Can_Not_Update_Records();
        }

        private static object[] Simple_Users_Can_Not_Update_Records() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("0316855d-d5da-44a6-b09c-89a8d014a963"),
                    CustomerId = 1,
                    DestinationId = 3,
                    PickupPointId = 65,
                    Date = "2022-02-02",
                    TicketNo = "ETTUU"
                }
            };
        }

    }

}