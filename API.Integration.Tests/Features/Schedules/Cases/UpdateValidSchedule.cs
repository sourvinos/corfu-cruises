using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Schedules {

    public class UpdateValidSchedule : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new UpdateTestSchedule {
                    FeatureUrl = "/schedules/1",
                    StatusCode = 200,
                    Id = 1,
                    DestinationId = 1,
                    PortId = 1,
                    Date = "2021-10-01",
                    MaxPersons = 185
                }
            };
        }

    }

}