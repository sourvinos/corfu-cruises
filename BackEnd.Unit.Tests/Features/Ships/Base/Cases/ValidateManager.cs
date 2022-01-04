using System.Collections;
using System.Collections.Generic;
using BackEnd.UnitTests.Infrastructure;
using API.Features.Ships.Base;

namespace BackEnd.UnitTests.Ships.Base {

    public class ValidateManager : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Manager_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Manager_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new ShipWriteResource {
                    Manager = Helpers.GetLongString()
                }
            };
        }

    }

}
