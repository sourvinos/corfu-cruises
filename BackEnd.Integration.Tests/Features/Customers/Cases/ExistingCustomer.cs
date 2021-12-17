using System;
using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Customers {

    public class ExistingCustomer : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestCustomer {
                    FeatureUrl = "/customers/1",
                    Id = 1,
                    Description = new Guid().ToString(),
                }
            };
        }

    }

}
