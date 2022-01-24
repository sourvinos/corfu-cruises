using API.IntegrationTests.Infrastructure;
using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Ports {

    public class CreateValidPort : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestPort {
                    FeatureUrl = "/ports/",
                    Description = Helpers.CreateRandomString(128),
                    IsPrimary = true
                }
            };
        }

    }

}
