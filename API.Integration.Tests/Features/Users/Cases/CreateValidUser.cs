using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Users {

    public class CreateValidUser : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestUser {
                    UserName = Helpers.CreateRandomString(128),
                    Displayname = Helpers.CreateRandomString(128),
                    CustomerId = 1,
                    Email = "email@server.com",
                    Password = "abcd1234",
                    ConfirmPassword = "abcd1234"
                }
            };
        }

    }

}
