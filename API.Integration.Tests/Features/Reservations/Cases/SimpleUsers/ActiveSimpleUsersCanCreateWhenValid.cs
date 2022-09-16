using System;
using System.Collections;
using System.Collections.Generic;

namespace API.Integration.Tests.Reservations {

    public class ActiveSimpleUsersCanCreateWhenValid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Simple_Users_Can_Create_Records_For_Future_Date();
        }

        private static object[] Simple_Users_Can_Create_Records_For_Future_Date() {
            return new object[] {
                new TestNewReservation {
                    Date = "2022-09-15",
                    TestDateNow = new DateTime(2022, 09, 14, 12, 0, 0),
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 12,
                    TicketNo = "xxxx",
                    Adults = 3,
                    Passengers = new List<TestPassenger>()
                }
            };
        }

    }

}
