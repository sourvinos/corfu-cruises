using System.Collections;
using System.Collections.Generic;

namespace BackEnd.UnitTests.Reservations {

    public class InvalidDate : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Date_Can_Not_Be_Empty();
            yield return Date_Can_Not_Be_Null();
        }

        private static object[] Date_Can_Not_Be_Empty() {
            return new object[] { "" };
        }

        private static object[] Date_Can_Not_Be_Null() {
            return new object[] { null };
        }

    }

}
