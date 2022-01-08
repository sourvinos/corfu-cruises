using System.Collections;
using System.Collections.Generic;

namespace API.UnitTests.Ships.Routes {

    public class ValidateToTime : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ToTime_Can_Not_Be_Null();
            yield return ToTime_Can_Not_Be_Empty();
            yield return ToTime_Can_Not_Be_Invalid();
        }

        private static object[] ToTime_Can_Not_Be_Null() {
            return new object[] { null };
        }

        private static object[] ToTime_Can_Not_Be_Empty() {
            return new object[] { string.Empty };
        }

        private static object[] ToTime_Can_Not_Be_Invalid() {
            return new object[] { "41:45" };
        }

    }

}
