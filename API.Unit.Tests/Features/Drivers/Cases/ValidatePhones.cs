using System.Collections;
using System.Collections.Generic;
using API.UnitTests.Infrastructure;

namespace API.UnitTests.Drivers {

    public class ValidatePhones : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Phones_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Phones_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] { Helpers.GetLongString() };
        }

    }

}
