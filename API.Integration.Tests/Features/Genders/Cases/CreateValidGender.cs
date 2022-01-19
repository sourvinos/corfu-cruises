using API.IntegrationTests.Infrastructure;
using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Genders {

    public class CreateValidGender : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestGender {
                    FeatureUrl = "/genders/",
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
