using System.Collections;
using System.Collections.Generic;
using BackEnd.UnitTests.Infrastructure;

namespace BackEnd.UnitTests.Reservations {

    public class InvalidTicketNo : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return TicketNo_Can_Not_Be_Empty();
            yield return TicketNo_Can_Not_Be_Null();
            yield return TicketNo_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] TicketNo_Can_Not_Be_Empty() {
            return new object[] { "" };
        }

        private static object[] TicketNo_Can_Not_Be_Null() {
            return new object[] { null };
        }

        private static object[] TicketNo_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] { Helpers.GetLongString() };
        }

    }

}
