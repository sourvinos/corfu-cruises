using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.ShipRoutes {

    public class UpdateValidShipRoute : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestShipRoute {
                    FeatureUrl = "/shipRoutes/1",
                    Id = 1,
                    Description = Helpers.CreateRandomString(128),
                    FromPort = Helpers.CreateRandomString(128),
                    FromTime = "08:00",
                    ToPort =  Helpers.CreateRandomString(128),
                    ToTime = "10:00"
                }
            };
        }

    }

}
