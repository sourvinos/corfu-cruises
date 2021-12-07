using System;
using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests {

    public class InvalidCredentials : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return this.Invalid_Credentials();
        }

        private object[] Invalid_Credentials() {
            return new object[] {
                new ReservationWrite {
                    ReservationId = Guid.Parse("4d9fb197-b3e2-4834-b150-153896418591"),
                    Username = "user-does-not-exist",
                    Password = "not-a-valid-password",
                    UserId = "not-a-valid-userId",
                    ExpectedError = 401,
                    Date = "2021-10-01",
                    DestinationId = 1,
                    CustomerId = 1,
                    PortId = 1,
                    Adults = 3,
                    TicketNo = "xxxx"
                }
            };
        }

    }

}
