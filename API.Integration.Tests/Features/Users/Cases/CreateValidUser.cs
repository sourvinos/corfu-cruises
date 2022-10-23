using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace IntegrationTests.Users {

    public class CreateValidUser : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestNewUser {
                    UserName = "username",
                    Displayname = "Display Name",
                    CustomerId = 1,
                    Email = "new-email@server.com",
                    Password = "abcd1234",
                    ConfirmPassword = "abcd1234"
                }
            };
        }

    }

}
