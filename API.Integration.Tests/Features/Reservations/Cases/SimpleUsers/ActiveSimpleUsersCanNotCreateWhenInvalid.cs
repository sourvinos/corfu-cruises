using System.Collections;
using System.Collections.Generic;
using API.Infrastructure.Implementations;

namespace API.Integration.Tests.Reservations {

    public class ActiveSimpleUsersCanNotCreateWhenInvalid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            // yield return Simple_Users_Can_Not_Create_Records_After_Departure();
            yield return Simple_Users_Can_Not_Add_Reservation_With_Transfer_During_Night_Hours();
            // yield return Simple_Users_Can_Not_Add_Reservation_After_Departure();
        }

        private static object[] Simple_Users_Can_Not_Create_Records_After_Departure() {
            return new object[] {
                new TestNewReservation {
                    StatusCode = 431,
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 12,
                    Date = "2022-03-25",
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

        private static object[] Simple_Users_Can_Not_Add_Reservation_With_Transfer_During_Night_Hours() {
            return new object[] {
                new TestNewReservation {
                    StatusCode = 459,
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 12,
                    Date = "2022-05-30",
                    TicketNo = "xxxx",
                    Adults = 2,
                    Kids = 1
                }
            };
        }

        private static object[] Simple_Users_Can_Not_Add_Reservation_After_Departure() {
            return new object[] {
                new TestNewReservation {
                    StatusCode = 431,
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 12,
                    Date = "2022-05-29",
                    TicketNo = "xxxx",
                    Adults = 2,
                    Kids = 1
                }
            };
        }

    }

}
