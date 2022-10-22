using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Users {

    public class CreateInvalidUser : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Customer_Must_Exist();
            yield return Customer_Must_Be_Active();
            yield return UsernameAlreadyExists();
            yield return EmailAlreadyExists();
        }

        private static object[] UsernameAlreadyExists() {
            return new object[] {
                new TestUser {
                    StatusCode = 498,
                    UserName = "foteini",
                    Displayname = "FOTEINI",
                    CustomerId = 2,
                    Email = "martav869@gmail.com",
                    IsAdmin = false,
                    IsActive = true
                }
            };
        }

        private static object[] EmailAlreadyExists() {
            return new object[] {
                new TestUser {
                    StatusCode = 498,
                    UserName = "simpleuser",
                    Displayname = "Simple User",
                    CustomerId = 2,
                    Email = "operations.corfucruises@gmail.com",
                    IsAdmin = false,
                    IsActive = true
                }
            };
        }


        private static object[] Customer_Must_Exist() {
            return new object[] {
                new TestUser {
                    StatusCode = 450,
                    CustomerId = 3,
                    UserName = Helpers.CreateRandomString(128),
                    Displayname = Helpers.CreateRandomString(128),
                    Email = "email@server.com",
                    Password = "abcd1234",
                    ConfirmPassword = "abcd1234"
                }
            };
        }

        private static object[] Customer_Must_Be_Active() {
            return new object[] {
                new TestUser {
                    StatusCode = 450,
                    CustomerId = 63,
                    UserName = Helpers.CreateRandomString(128),
                    Displayname = Helpers.CreateRandomString(128),
                    Email = "email@server.com",
                    Password = "abcd1234",
                    ConfirmPassword = "abcd1234"
                }
            };
        }

    }

}
