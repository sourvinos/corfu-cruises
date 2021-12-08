using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests {

    public class DummyReservation : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return this.Reservation_With_Invalid_Credentials();
        }

        private object[] Reservation_With_Invalid_Credentials() {
            return new object[] {
                new Reservation {
                    FeatureUrl = "/reservations/",
                    ReservationId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
                    Username = "invalid-user-name",
                    Password = "invalid-password",
                    UserId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
                    ExpectedResponseCode = 401
                }
            };
        }

    }

}
