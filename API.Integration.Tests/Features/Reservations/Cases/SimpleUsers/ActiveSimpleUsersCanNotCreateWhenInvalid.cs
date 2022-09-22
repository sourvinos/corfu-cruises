using System;
using System.Collections;
using System.Collections.Generic;

namespace API.Integration.Tests.Reservations {

    public class ActiveSimpleUsersCanNotCreateWhenInvalid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Simple_Users_Can_Not_Add_Reservation_With_Transfer_For_Tomorrow_Between_Closing_Time_And_Midnight();
            yield return Simple_Users_Can_Not_Add_Reservation_With_Transfer_For_Today_Between_Midnight_And_Departure();
            yield return Simple_Users_Can_Not_Add_Reservations_After_Departure();
            yield return Simple_Users_Can_Not_Add_Reservations_Which_Cause_Overbooking_From_Primary_Port();
        }

        private static object[] Simple_Users_Can_Not_Add_Reservation_With_Transfer_For_Tomorrow_Between_Closing_Time_And_Midnight() {
            return new object[] {
                new TestNewReservation {
                    StatusCode = 459,
                    Date = "2022-05-30",
                    TestDateNow = new DateTime(2022, 5, 29, 22, 30, 00),
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 12,
                    TicketNo = "xxxx",
                    Adults = 2,
                    Kids = 1
                }
            };
        }

        private static object[] Simple_Users_Can_Not_Add_Reservation_With_Transfer_For_Today_Between_Midnight_And_Departure() {
            return new object[] {
                new TestNewReservation {
                    StatusCode = 459,
                    Date = "2022-05-29",
                    TestDateNow = new DateTime(2022, 5, 29, 06, 30, 00),
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 12,
                    TicketNo = "xxxx",
                    Adults = 2,
                    Kids = 1
                }
            };
        }

        private static object[] Simple_Users_Can_Not_Add_Reservations_After_Departure() {
            return new object[] {
                new TestNewReservation {
                    StatusCode = 431,
                    Date = "2022-03-25",
                    TestDateNow = new DateTime(2022, 3, 25, 12, 45, 00),
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 12,
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

        private static object[] Simple_Users_Can_Not_Add_Reservations_Which_Cause_Overbooking_From_Primary_Port() {
            return new object[] {
                new TestNewReservation {
                    StatusCode = 433,
                    Date = "2022-09-15",
                    TestDateNow = new DateTime(2022, 09, 14, 12, 0, 0),
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 12,
                    TicketNo = "xxxx",
                    Adults = 500,
                    Passengers = new List<TestPassenger>()
                }
            };
        }

    }

}
