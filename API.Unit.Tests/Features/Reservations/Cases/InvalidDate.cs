using System.Collections;
using System.Collections.Generic;

namespace API.UnitTests.Reservations {

    public class InvalidDate : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Date_Can_Not_Be_Empty();
            yield return Date_Can_Not_Be_Null();
            yield return Date_Can_Not_Be_In_Wrong_Format();
        }

        private static object[] Date_Can_Not_Be_Empty() {
            return new object[] { "" };
        }

        private static object[] Date_Can_Not_Be_Null() {
            return new object[] { null };
        }

        private static object[] Date_Can_Not_Be_In_Wrong_Format() {
            return new object[] { "01-01-2020" };
        }

    }

}
