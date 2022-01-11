using System.Collections;
using System.Collections.Generic;
using API.UnitTests.Infrastructure;

namespace API.UnitTests.Ships.Base {

    public class ValidateRegistryNo : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Can_Not_Be_Longer_Than_Maximum() {
            return new object[] { Helpers.GetLongString() };
        }

    }

}
