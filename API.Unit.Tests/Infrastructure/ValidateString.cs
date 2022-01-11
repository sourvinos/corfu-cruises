using System.Collections;
using System.Collections.Generic;

namespace API.UnitTests.Infrastructure {

    public class ValidateString : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Can_Not_Be_Null();
            yield return Can_Not_Be_Empty();
            yield return Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Can_Not_Be_Null() {
            return new object[] { null };
        }

        private static object[] Can_Not_Be_Empty() {
            return new object[] { string.Empty };
        }

        private static object[] Can_Not_Be_Longer_Than_Maximum() {
            return new object[] { Helpers.GetLongString() };
        }

    }

}
