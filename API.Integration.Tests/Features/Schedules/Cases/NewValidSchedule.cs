using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Schedules;

namespace API.IntegrationTests.Routes {

    public class NewValidSchedule : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return CreateValidSchedule();
        }

        private static object[] CreateValidSchedule() {
            return new object[] {
                new TestSchedule {
                    FeatureUrl = "/schedules/",
                    TestScheduleBody = new List<TestScheduleBody>() {
                        new TestScheduleBody {
                            PortId = 1,
                            DestinationId = 1,
                            Date = "2021-10-01",
                            MaxPersons = 185
                        },
                        new TestScheduleBody {
                            PortId = 1,
                            DestinationId = 1,
                            Date = "2021-10-02",
                            MaxPersons = 185
                        },
                    }
                }
            };
        }

    }

}