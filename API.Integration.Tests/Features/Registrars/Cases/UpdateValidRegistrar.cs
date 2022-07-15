using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Registrars {

    public class UpdateValidRegistrar : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestRegistrar {
                    Id = 7,
                    ShipId = 6,
                    Fullname = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
