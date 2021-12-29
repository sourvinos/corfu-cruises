using System.Collections;
using System.Collections.Generic;
using BackEnd.UnitTests.Infrastructure;
using BlueWaterCruises.Features.Ships.Base;

namespace BackEnd.UnitTests.Ships.Base {

    public class ValidateRegistryNo : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return RegistryNo_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] RegistryNo_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new ShipWriteResource {
                    RegistryNo = Helpers.GetLongString()
                }
            };
        }

    }

}
