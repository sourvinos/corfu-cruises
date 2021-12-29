using System.Collections;
using System.Collections.Generic;
using BackEnd.UnitTests.Infrastructure;
using BlueWaterCruises.Features.Destinations;

namespace BackEnd.UnitTests.Destinations {

    public class ValidateAbbreviation : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Abbreviation_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Abbreviation_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new DestinationWriteResource {
                    Abbreviation = Helpers.GetLongString()
                }
            };
        }

    }

}
