using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Routes {

    public class UpdateValidRoute : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestRoute {
                    Id = 1,
                    PortId = 1,
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation = Helpers.CreateRandomString(10)
                }
            };
        }

    }

}