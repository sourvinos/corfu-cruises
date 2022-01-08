using System.Collections;
using System.Collections.Generic;

namespace API.UnitTests.Destinations {

    public class ValidateAbbreviation : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Abbreviation_Can_Not_Be_Null();
            yield return Abbreviation_Can_Not_Be_Empty();
            yield return Abbreviation_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Abbreviation_Can_Not_Be_Null() {
            return new object[] { null };
        }

        private static object[] Abbreviation_Can_Not_Be_Empty() {
            return new object[] { string.Empty };
        }

        private static object[] Abbreviation_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] { "123456" };
        }


    }

}
