using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.IntegrationTests.PickupPoints {

    public class UpdateInvalidPickupPoint : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Route_Must_Exist();
            yield return Route_Must_Be_Active();
        }

        private static object[] Route_Must_Exist() {
            return new object[] {
                new TestPickupPoint {
                    StatusCode = 450,
                    Id = 1,
                    RouteId = 99,
                    Description = Helpers.CreateRandomString(128),
                    ExactPoint = Helpers.CreateRandomString(128),
                    Time = "08:00",
                    Coordinates = Helpers.CreateRandomString(128)
                }
            };
        }

        private static object[] Route_Must_Be_Active() {
            return new object[] {
                new TestPickupPoint {
                    StatusCode = 450,
                    Id = 9,
                    RouteId = 99,
                    Description = Helpers.CreateRandomString(128),
                    ExactPoint = Helpers.CreateRandomString(128),
                    Time = "08:00",
                    Coordinates = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
