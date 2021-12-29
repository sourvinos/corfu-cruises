using System.Collections;
using System.Collections.Generic;
using BackEnd.IntegrationTests.Ships.Owners;

namespace BackEnd.IntegrationTests.Ships.Base {

    public class ExistingOwner : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return new object[] {
                new TestOwner {
                    FeatureUrl = "/shipOwners/1",
                    Id = 1,
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
