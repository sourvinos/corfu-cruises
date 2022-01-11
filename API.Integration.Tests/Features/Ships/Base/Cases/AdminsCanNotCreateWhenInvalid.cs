using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.Ships.Base {

    public class AdminsCanNotCreateWhenInvalid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ShipOwner_Must_Exist();
            yield return ShipOwner_Must_Be_Active();
        }

        private static object[] ShipOwner_Must_Exist() {
            return new object[] {
                new TestShip {
                    FeatureUrl = "/ships/",
                    StatusCode = 450,
                    ShipOwnerId = 3,
                    Description = Helpers.CreateRandomString(5),
                }
            };
        }

        private static object[] ShipOwner_Must_Be_Active() {
            return new object[] {
                new TestShip {
                    FeatureUrl = "/ships/",
                    StatusCode = 450,
                    ShipOwnerId = 2,
                    Description = Helpers.CreateRandomString(5),
                }
            };
        }

    }

}
