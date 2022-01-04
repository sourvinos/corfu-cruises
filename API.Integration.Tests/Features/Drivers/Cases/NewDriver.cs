using API.IntegrationTests.Infrastructure;
using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Drivers {

    public class NewDriver : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestDriver {
                    FeatureUrl = "/drivers/",
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
