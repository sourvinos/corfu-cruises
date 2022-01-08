using System.Collections;
using System.Collections.Generic;
using API.UnitTests.Infrastructure;

namespace API.UnitTests.Destinations {

    public class ValidateDescription : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Description_Can_Not_Be_Null();
            yield return Description_Can_Not_Be_Empty();
            yield return Description_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Description_Can_Not_Be_Null() {
            return new object[] { null };
        }

        private static object[] Description_Can_Not_Be_Empty() {
            return new object[] { string.Empty };
        }

        private static object[] Description_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] { Helpers.GetLongString() };
        }

    }

}
