using System;
using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Reservations {

    public class ExistingReservation : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Reservation_With_Invalid_Credentials();
        }

        private static object[] Reservation_With_Invalid_Credentials() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    ReservationId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
                }
            };
        }

    }

}
