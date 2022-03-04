using System.Collections;
using System.Collections.Generic;

namespace API.Integration.Tests.Schedules {

    public class CreateValidSchedule : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new NewTestSchedule {
                    TestScheduleBody = new List<TestScheduleBody>() {
                        new TestScheduleBody { DestinationId = 1, PortId = 1, Date = "2022-02-01", MaxPassengers = 185 },
                        new TestScheduleBody { DestinationId = 1, PortId = 1, Date = "2021-10-02", MaxPassengers = 185 }
                    }
                }
            };
        }

    }

}