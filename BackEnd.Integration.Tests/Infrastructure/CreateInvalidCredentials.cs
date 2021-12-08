using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests {

    public class CreateInvalidCredentials : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return this.Invalid_Credentials();
        }

        private object[] Invalid_Credentials() {
            return new object[] {
                new Reservation {
                    Username = "user-does-not-exist",
                    Password = "not-a-valid-password",
                    UserId = "not-a-valid-userId",
                    ExpectedResponseCode = 401
                }
            };
        }

    }

}
