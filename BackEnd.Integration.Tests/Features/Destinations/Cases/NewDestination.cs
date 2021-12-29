using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Destinations {

    public class NewDestination : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestDestination {
                    FeatureUrl = "/destinations/",
                    Abbreviation = Helpers.CreateRandomString(5),
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
