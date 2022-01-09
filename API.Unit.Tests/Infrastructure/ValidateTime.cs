using System.Collections;
using System.Collections.Generic;

namespace API.UnitTests.Infrastructure {

    public class ValidateTime : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Time_Can_Not_Be_Null();
            yield return Time_Can_Not_Be_Empty();
            yield return Time_Can_Not_Be_Invalid();
            yield return Time_Can_Not_Be_Hour_Short();
            yield return Time_Can_Not_Be_Minute_Short();
        }

        private static object[] Time_Can_Not_Be_Null() {
            return new object[] { null };
        }

        private static object[] Time_Can_Not_Be_Empty() {
            return new object[] { string.Empty };
        }

        private static object[] Time_Can_Not_Be_Invalid() {
            return new object[] { "41:45" };
        }

        private static object[] Time_Can_Not_Be_Hour_Short() {
            return new object[] { "1:45" };
        }

        private static object[] Time_Can_Not_Be_Minute_Short() {
            return new object[] { "01:5" };
        }

    }

}
