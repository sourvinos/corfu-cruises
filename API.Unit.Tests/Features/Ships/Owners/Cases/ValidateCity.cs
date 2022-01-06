using System.Collections;
using System.Collections.Generic;
using API.Features.Ships.Owners;
using API.UnitTests.Infrastructure;

namespace API.UnitTests.Ships.Owners {

    public class ValidateCity : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return City_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] City_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new ShipOwnerWriteResource {
                    City = Helpers.GetLongString()
                }
            };
        }

    }

}
