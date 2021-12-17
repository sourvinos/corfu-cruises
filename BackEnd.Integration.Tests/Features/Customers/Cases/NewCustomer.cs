using System;
using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Customers {

    public class NewCustomer : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestCustomer {
                    FeatureUrl = "/customers/",
                    Description = new Guid().ToString()
                }
            };
        }

    }

}
