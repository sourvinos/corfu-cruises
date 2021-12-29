using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Destinations {

    public class ExistingDestination : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestDestination {
                    FeatureUrl = "/destinations/1",
                    Id = 1,
                    Abbreviation = Helpers.CreateRandomString(5),
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
