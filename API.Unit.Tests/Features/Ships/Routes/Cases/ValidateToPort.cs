using System.Collections;
using System.Collections.Generic;
using API.UnitTests.Infrastructure;

namespace API.UnitTests.Ships.Routes {

    public class ValidateToPort : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ToPort_Can_Not_Be_Null();
            yield return ToPort_Can_Not_Be_Empty();
            yield return ToPort_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] ToPort_Can_Not_Be_Null() {
            return new object[] { null };
        }

        private static object[] ToPort_Can_Not_Be_Empty() {
            return new object[] { string.Empty };
        }

        private static object[] ToPort_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] { Helpers.GetLongString() };
        }

    }

}
