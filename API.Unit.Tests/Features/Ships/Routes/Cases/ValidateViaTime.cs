using System.Collections;
using System.Collections.Generic;

namespace API.UnitTests.Ships.Routes {

    public class ValidateViaTime : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ViaTime_Can_Not_Be_Invalid();
            yield return ViaTime_Can_Not_Be_Hour_Short();
            yield return ViaTime_Can_Not_Be_Minute_Short();
        }

        private static object[] ViaTime_Can_Not_Be_Invalid() {
            return new object[] { "41:45" };
        }

        private static object[] ViaTime_Can_Not_Be_Hour_Short() {
            return new object[] { "1:45" };
        }

        private static object[] ViaTime_Can_Not_Be_Minute_Short() {
            return new object[] { "01:5" };
        }

    }

}
