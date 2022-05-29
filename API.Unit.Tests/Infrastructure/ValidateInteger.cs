using System.Collections;
using System.Collections.Generic;

namespace API.UnitTests.Infrastructure {

    public class ValidateZeroOrGreaterInteger : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Can_Not_Be_Null();
            yield return Can_Not_Be_Negative();
            yield return Can_Not_Be_Greater_Than_999();
        }

        private static object[] Can_Not_Be_Null() {
            return new object[] { null };
        }

        private static object[] Can_Not_Be_Negative() {
            return new object[] { -1 };
        }

        private static object[] Can_Not_Be_Greater_Than_999() {
            return new object[] { 1000 };
        }

    }

}
