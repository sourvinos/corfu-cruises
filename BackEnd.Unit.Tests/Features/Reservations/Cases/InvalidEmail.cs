using System.Collections;
using System.Collections.Generic;

namespace BackEnd.UnitTests.Reservations {

    public class InvalidEmail : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Email_First_Case();
            yield return Email_Second_Case();
            yield return Email_Third_Case();
            yield return Email_Fourth_Case();
            yield return Email_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Email_First_Case() {
            return new object[] { "ThisIsNotAnEmail" };
        }

        private static object[] Email_Second_Case() {
            return new object[] { "ThisIsNotAnEmail@SomeServer." };
        }

        private static object[] Email_Third_Case() {
            return new object[] { "ThisIsNotAnEmail@SomeServer@" };
        }

        private static object[] Email_Fourth_Case() {
            return new object[] { "ThisIsNotAnEmail@SomeServer@.com." };
        }

        private static object[] Email_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] { Helpers.GetLongString() };
        }

    }

}
