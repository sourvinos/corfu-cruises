using System.Collections;
using System.Collections.Generic;
using BackEnd.UnitTests.Infrastructure;
using API.Features.Ships.Owners;

namespace BackEnd.UnitTests.Ships.Owners {

    public class ValidateTaxNo : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return TaxNo_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] TaxNo_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new ShipOwnerWriteResource {
                    TaxNo = Helpers.GetLongString()
                }
            };
        }

    }

}
