using System.Collections;
using System.Collections.Generic;

namespace API.Integration.Tests.Schedules {

    public class UpdateInvalidSchedule : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Destination_Must_Exist();
            yield return Destination_Must_Be_Active();
            yield return Destination_Must_Not_Be_Null();
            yield return Port_Must_Exist();
            yield return Port_Must_Be_Active();
            yield return Port_Must_Not_Be_Null();
        }

        private static object[] Destination_Must_Exist() {
            return new object[] {
                new UpdateTestSchedule {
                    StatusCode = 450,
                    Id = 1,
                    DestinationId = 6,
                    PortId = 1,
                    Date = "2022-02-01",
                    MaxPersons = 185
                }
            };
        }

        private static object[] Destination_Must_Be_Active() {
            return new object[] {
                new UpdateTestSchedule {
                    StatusCode = 450,
                    Id = 1,
                    DestinationId = 5,
                    PortId = 1,
                    Date = "2022-02-01",
                    MaxPersons = 185
                }
            };
        }

        private static object[] Destination_Must_Not_Be_Null() {
            return new object[] {
                new UpdateTestSchedule {
                    StatusCode = 450,
                    Id = 1,
                    PortId = 1,
                    Date = "2022-02-01",
                    MaxPersons = 185
                }
            };
        }

        private static object[] Port_Must_Exist() {
            return new object[] {
                new UpdateTestSchedule {
                    StatusCode = 451,
                    Id = 1,
                    DestinationId = 1,
                    PortId = 9,
                    Date = "2022-02-01",
                    MaxPersons = 185
                },
            };
        }

        private static object[] Port_Must_Be_Active() {
            return new object[] {
                new UpdateTestSchedule {
                    StatusCode = 451,
                    Id = 1,
                    DestinationId = 1,
                    PortId = 3,
                    Date = "2022-02-01",
                    MaxPersons = 185
                }
            };
        }

        private static object[] Port_Must_Not_Be_Null() {
            return new object[] {
                new UpdateTestSchedule {
                    StatusCode = 451,
                    Id = 1,
                    DestinationId = 1,
                    Date = "2022-02-01",
                    MaxPersons = 185
                }
            };
        }

    }

}