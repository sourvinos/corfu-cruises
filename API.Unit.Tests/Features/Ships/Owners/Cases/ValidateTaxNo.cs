using System.Collections;
using System.Collections.Generic;
using API.UnitTests.Infrastructure;

namespace API.UnitTests.Ships.Owners {

    public class ValidateTaxNo : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return TaxNo_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] TaxNo_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] { Helpers.GetLongString() };
        }

    }

}
