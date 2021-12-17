using System.Collections;
using System.Collections.Generic;
using BlueWaterCruises.Features.Customers;

namespace BackEnd.UnitTests.Customers {

    public class ValidateAddress : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Address_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Address_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new CustomerWriteResource {
                    Address = Helpers.CreateRandomString(129)
                }
            };
        }

    }

}
