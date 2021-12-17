using System.Collections;
using System.Collections.Generic;
using BlueWaterCruises.Features.Customers;

namespace BackEnd.UnitTests.Customers {

    public class ValidateEmail : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Email_First_Case();
            yield return Email_Second_Case();
            yield return Email_Third_Case();
            yield return Email_Fourth_Case();
            yield return Email_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Email_First_Case() {
            return new object[] {
                new CustomerWriteResource {
                    Email = "ThisIsNotAnEmail"
                }
            };
        }

        private static object[] Email_Second_Case() {
            return new object[] {
                new CustomerWriteResource {
                    Email = "ThisIsNotAnEmail@SomeServer."
                }
            };
        }

        private static object[] Email_Third_Case() {
            return new object[] {
                new CustomerWriteResource {
                    Email = "ThisIsNotAnEmail@SomeServer@"
                }
            };
        }

        private static object[] Email_Fourth_Case() {
            return new object[] {
                new CustomerWriteResource {
                    Email = "ThisIsNotAnEmail@SomeServer@.com."
                }
            };
        }

        private static object[] Email_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new CustomerWriteResource {
                    Email = Helpers.CreateRandomString(129)
                }
            };
        }

    }

}
