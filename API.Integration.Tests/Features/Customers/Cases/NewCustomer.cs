using API.IntegrationTests.Infrastructure;
using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Customers {

    public class NewCustomer : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestCustomer {
                    FeatureUrl = "/customers/",
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
