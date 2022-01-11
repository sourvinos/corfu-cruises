using System.Collections;
using System.Collections.Generic;

namespace API.UnitTests.Ships.Base {

    public class ValidateShipOwnerId : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Can_Not_Be_Null();
            yield return Can_Not_Be_Zero();
        }

        private static object[] Can_Not_Be_Null() {
            return new object[] { null };
        }

        private static object[] Can_Not_Be_Zero() {
            return new object[] { 0 };
        }

    }

}
