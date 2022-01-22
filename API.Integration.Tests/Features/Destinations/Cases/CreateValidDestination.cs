using API.IntegrationTests.Infrastructure;
using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Destinations {

    public class CreateValidDestination : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestDestination {
                    FeatureUrl = "/destinations/",
                    Abbreviation = Helpers.CreateRandomString(5),
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
