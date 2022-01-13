using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.PickupPoints {

    public class EditMinimalPickupPoint : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return CreateMinimalRecord();
        }

        private static object[] CreateMinimalRecord() {
            return new object[] {
                new TestPickupPoint {
                    FeatureUrl = "/pickupPoints/1",
                    Id = 1,
                    RouteId = 1,
                    Description = Helpers.CreateRandomString(128),
                    ExactPoint = Helpers.CreateRandomString(128),
                    Time = "08:00",
                    Coordinates = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
