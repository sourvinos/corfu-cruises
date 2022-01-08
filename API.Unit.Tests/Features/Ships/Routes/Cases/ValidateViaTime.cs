using System.Collections;
using System.Collections.Generic;

namespace API.UnitTests.Ships.Routes {

    public class ValidateViaTime : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ViaTime_Can_Not_Be_Invalid();
        }

        private static object[] ViaTime_Can_Not_Be_Invalid() {
            return new object[] { "41:45" };
        }

    }

}
