using System.Collections;
using System.Collections.Generic;

namespace API.Integration.Tests.Schedules {

    public class CreateInvalidSchedule : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Destination_Must_Exist();
            yield return Destination_Must_Be_Active();
            yield return Port_Must_Exist();
            yield return Port_Must_Be_Active();
        }

        private static object[] Destination_Must_Exist() {
            return new object[] {
                new NewTestSchedule {
                    StatusCode = 450,
                    TestScheduleBody = new List<TestScheduleBody>() {
                        new TestScheduleBody {
                            DestinationId = 6,
                            PortId = 1,
                            Date = "2022-02-01",
                            MaxPassengers = 185
                        },
                        new TestScheduleBody {
                            DestinationId = 6,
                            PortId = 1,
                            Date = "2021-10-02",
                            MaxPassengers = 185
                        }
                    }
                }
            };
        }

        private static object[] Destination_Must_Be_Active() {
            return new object[] {
                new NewTestSchedule {
                    StatusCode = 450,
                    TestScheduleBody = new List<TestScheduleBody>() {
                        new TestScheduleBody {
                            DestinationId = 5,
                            PortId = 1,
                            Date = "2022-02-01",
                            MaxPassengers = 185
                        },
                        new TestScheduleBody {
                            DestinationId = 5,
                            PortId = 1,
                            Date = "2021-10-02",
                            MaxPassengers = 185
                        }
                    }
                }
            };
        }

        private static object[] Port_Must_Exist() {
            return new object[] {
                new NewTestSchedule {
                    StatusCode = 451,
                    TestScheduleBody = new List<TestScheduleBody>() {
                        new TestScheduleBody {
                            DestinationId = 1,
                            PortId = 9,
                            Date = "2022-02-01",
                            MaxPassengers = 185
                        },
                        new TestScheduleBody {
                            DestinationId = 1,
                            PortId = 9,
                            Date = "2021-10-02",
                            MaxPassengers = 185
                        }
                    }
                }
            };
        }

        private static object[] Port_Must_Be_Active() {
            return new object[] {
                new NewTestSchedule {
                    StatusCode = 451,
                    TestScheduleBody = new List<TestScheduleBody>() {
                        new TestScheduleBody {
                            DestinationId = 1,
                            PortId = 3,
                            Date = "2022-02-01",
                            MaxPassengers = 185
                        },
                        new TestScheduleBody {
                            DestinationId = 1,
                            PortId = 3,
                            Date = "2021-10-02",
                            MaxPassengers = 185
                        }
                    }
                }
            };
        }


    }

}