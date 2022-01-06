using System.Collections;
using System.Collections.Generic;

namespace API.UnitTests.Reservations {

    public class InvalidDestinationId : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return DestinationId_Can_Not_Be_Empty();
            yield return DestinationId_Can_Not_Be_Null();
            yield return DestinationId_Can_Not_Be_Zero();
            yield return DestinationId_Must_Exist();
            yield return DestinationId_Must_Be_Active();
        }

        private static object[] DestinationId_Can_Not_Be_Empty() {
            return new object[] { "" };
        }

        private static object[] DestinationId_Can_Not_Be_Null() {
            return new object[] { null };
        }

        private static object[] DestinationId_Can_Not_Be_Zero() {
            return new object[] { 0 };
        }

        private static object[] DestinationId_Must_Exist() {
            return new object[] { 99 };
        }

        private static object[] DestinationId_Must_Be_Active() {
            return new object[] { 4 };
        }

    }

}
