using System.Collections;
using System.Collections.Generic;

namespace API.UnitTests.Ships.Base {

    public class ValidateShipOwnerId : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ShipOwner_Can_Not_Be_Null();
            yield return ShipOwner_Can_Not_Be_Zero();
            yield return ShipOwner_Must_Exist();
            yield return ShipOwner_Must_Be_Active();
        }

        private static object[] ShipOwner_Can_Not_Be_Null() {
            return new object[] { null };
        }

        private static object[] ShipOwner_Can_Not_Be_Zero() {
            return new object[] { 0 };
        }

        private static object[] ShipOwner_Must_Exist() {
            return new object[] { 3 };
        }

        private static object[] ShipOwner_Must_Be_Active() {
            return new object[] { 2 };
        }

    }

}
