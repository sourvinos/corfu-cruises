using System.Collections;
using System.Collections.Generic;
using BackEnd.UnitTests.Infrastructure;
using BlueWaterCruises.Features.Ships.Registrars;

namespace BackEnd.UnitTests.Ships.Registrars {

    public class ValidateFax : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Fax_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Fax_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new RegistrarWriteResource {
                    Fax = Helpers.GetLongString()
                }
            };
        }

    }

}
