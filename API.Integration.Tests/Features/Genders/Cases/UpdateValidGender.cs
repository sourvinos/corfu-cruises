using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.Genders {

    public class UpdateValidGender : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestGender {
                    FeatureUrl = "/genders/1",
                    Id = 1,
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
