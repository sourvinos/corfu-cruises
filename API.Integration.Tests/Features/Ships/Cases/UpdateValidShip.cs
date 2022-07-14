using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Ships {

    public class UpdateValidShip : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestShip {
                    Id = 6,
                    ShipOwnerId = 4,
                    Description = Helpers.CreateRandomString(5),
                }
            };
        }

    }

}
