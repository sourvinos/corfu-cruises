using System.Collections;
using System.Collections.Generic;
using BackEnd.UnitTests.Infrastructure;
using BlueWaterCruises.Features.Ships.Owners;

namespace BackEnd.UnitTests.Ships.Owners {

    public class ValidateProfession : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Profession_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Profession_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new ShipOwnerWriteResource {
                    Profession = Helpers.GetLongString()
                }
            };
        }

    }

}
