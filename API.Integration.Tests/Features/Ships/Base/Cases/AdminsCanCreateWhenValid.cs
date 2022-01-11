using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.Ships.Base {

    public class AdminsCanCreateWhenValid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Admins_Can_Create_Record();
        }

        private static object[] Admins_Can_Create_Record() {
            return new object[] {
                new TestShip {
                    FeatureUrl = "/ships/",
                    StatusCode = 200,
                    ShipOwnerId = 1,
                    Description = Helpers.CreateRandomString(5),
                }
            };
        }

    }

}
