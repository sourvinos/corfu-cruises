using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Customers {

    public class UpdateInvalidCustomer : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return NotFound();
        }

        private static object[] NotFound() {
            return new object[] {
                new TestCustomer {
                    Id = 9999,
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
