using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.Ports {

    public class UpdateValidPort : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestPort {
                    FeatureUrl = "/ports/1",
                    Id = 1,
                    Description = Helpers.CreateRandomString(128),
                    IsPrimary = true
                }
            };
        }

    }

}
