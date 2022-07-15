using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Registrars {

    public class CreateValidRegistrar : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestRegistrar {
                    ShipId = 7,
                    Fullname = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
