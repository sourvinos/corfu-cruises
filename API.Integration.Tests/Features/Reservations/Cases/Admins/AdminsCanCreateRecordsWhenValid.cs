using System.Collections;
using System.Collections.Generic;

namespace API.Integration.Tests.Reservations {

    public class AdminsCanCreateRecordWhenValid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Admins_Can_Create_Reservations_In_Past_Date();
            yield return Admins_Can_Create_Reservations_In_Future_Date();
            yield return Admins_Can_Create_With_Null_Driver();
            yield return Admins_Can_Create_With_Null_Ship();
        }

        private static object[] Admins_Can_Create_Reservations_In_Past_Date() {
            return new object[] {
                new TestReservation {
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 2,
                    Kids = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 123, OccupantId = 2, GenderId = 1 },
                        new TestPassenger { Lastname = "ALONA", Firstname = "CUTLER", Birthdate = "1964-04-28", NationalityId = 127, OccupantId = 2, GenderId = 2 },
                        new TestPassenger { Lastname = "LYA", Firstname = "TROWBRIDGE", Birthdate = "2015-01-21", NationalityId = 211, OccupantId = 2, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Admins_Can_Create_Reservations_In_Future_Date() {
            return new object[] {
                new TestReservation {
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    Date = "2025-01-01",
                    TicketNo = "xxxx",
                    Adults = 2,
                    Kids = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 123, OccupantId = 2, GenderId = 1 },
                        new TestPassenger { Lastname = "ALONA", Firstname = "CUTLER", Birthdate = "1964-04-28", NationalityId = 127, OccupantId = 2, GenderId = 2 },
                        new TestPassenger { Lastname = "LYA", Firstname = "TROWBRIDGE", Birthdate = "2015-01-21", NationalityId = 211, OccupantId = 2, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Admins_Can_Create_With_Null_Driver() {
            return new object[] {
                new TestReservation {
                    StatusCode = 200,
                    CustomerId = 1,
                    DestinationId = 1,
                    DriverId = null,
                    PickupPointId = 3,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 3,
                }
            };
        }

        private static object[] Admins_Can_Create_With_Null_Ship() {
            return new object[] {
                new TestReservation {
                    StatusCode = 200,
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    ShipId = null,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 3,
                }
            };
        }

    }

}
