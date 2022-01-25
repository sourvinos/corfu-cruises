using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Schedules {

    public class CreateValidSchedule : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new NewTestSchedule {
                    FeatureUrl = "/schedules/",
                    TestScheduleBody = new List<TestScheduleBody>() {
                        new TestScheduleBody { DestinationId = 1, PortId = 1, Date = "2021-10-01", MaxPersons = 185 },
                        new TestScheduleBody { DestinationId = 1, PortId = 1, Date = "2021-10-02", MaxPersons = 185 }
                    }
                }
            };
        }

    }

}