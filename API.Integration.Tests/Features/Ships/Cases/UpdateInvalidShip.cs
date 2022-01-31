using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Ships {

    public class UpdateInvalidShip : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ShipOwner_Must_Exist();
            yield return ShipOwner_Must_Be_Active();
        }

        private static object[] ShipOwner_Must_Exist() {
            return new object[] {
                new TestShip {
                    StatusCode = 450,
                    ShipOwnerId = 4,
                    Description = Helpers.CreateRandomString(5),
                }
            };
        }

        private static object[] ShipOwner_Must_Be_Active() {
            return new object[] {
                new TestShip {
                    StatusCode = 450,
                    ShipOwnerId = 3,
                    Description = Helpers.CreateRandomString(5),
                }
            };
        }

    }

}
