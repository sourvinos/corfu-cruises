using System.Collections;
using System.Collections.Generic;
using BackEnd.UnitTests.Infrastructure;
using API.Features.Customers;

namespace BackEnd.UnitTests.Customers {

    public class ValidatePersonInCharge : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return PersonInCharge_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] PersonInCharge_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new CustomerWriteResource {
                    PersonInCharge = Helpers.GetLongString()
                }
            };
        }

    }

}
