using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.IntegrationTests.Occupants {

    public class CreateValidOccupant : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestOccupant {
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
