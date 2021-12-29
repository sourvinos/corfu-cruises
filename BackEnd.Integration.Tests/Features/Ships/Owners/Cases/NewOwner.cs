using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Ships.Owners {

    public class NewOwner : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestOwner {
                    FeatureUrl = "/shipOwners/",
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
