using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Nationalities {

    public class UpdateValidNationality : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestNationality {
                    Id = 1,
                    Description = Helpers.CreateRandomString(128),
                    Code = Helpers.CreateRandomString(10)
                }
            };
        }

    }

}
