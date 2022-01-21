using System;
using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Reservations {

    public class AdminsCanNotCreateRecordsWhenInvalid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Nothing_For_This_Day();
            yield return Nothing_For_This_Day_And_This_Destination();
            yield return Nothing_For_This_Day_And_Destination_And_Port();
            yield return Overbooking_From_Primary_Port_Is_Not_Allowed();
            yield return Overbooking_From_Secondary_Port_Is_Not_Allowed();
            yield return Duplicate_Records_Are_Not_Allowed();
            yield return Customer_Must_Exist();
            yield return Customer_Must_Be_Active();
            yield return Destination_Must_Exist();
            yield return Destination_Must_Be_Active();
            yield return PickupPoint_Must_Exist();
            yield return PickupPoint_Must_Be_Active();
            yield return Driver_Must_Exist();
            yield return Driver_Must_Be_Active();
            yield return Ship_Must_Exist();
            yield return Ship_Must_Be_Active();
            yield return Passenger_Count_Is_Not_Correct();
            yield return Nationality_Must_Exist();
            yield return Nationality_Must_Be_Active();
            yield return Gender_Must_Exist();
            yield return Gender_Must_Be_Active();
            yield return Occupant_Must_Exist();
            yield return Occupant_Must_Be_Active();
        }

        private static object[] Nothing_For_This_Day() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 432,
                    Date = "2021-10-04",
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 1,
                    TicketNo = "xxxxxx"
                }
            };
        }

        private static object[] Nothing_For_This_Day_And_This_Destination() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 430,
                    Date = "2021-10-02",
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 1,
                    TicketNo = "xxxxxx"
                }
            };
        }

        private static object[] Nothing_For_This_Day_And_Destination_And_Port() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 427,
                    Date = "2021-10-02",
                    CustomerId = 1,
                    DestinationId = 3,
                    PickupPointId = 45,
                    TicketNo = "xxxxxx"
                }
            };
        }

        private static object[] Overbooking_From_Primary_Port_Is_Not_Allowed() {
            // According to the schedule: Max persons = 185 (Corfu)
            // According to the reservations: Corfu (84)
            // Free seats = 101
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 433,
                    Date = "2021-10-01",
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    Adults = 102,
                    TicketNo = "xxxxxx"
                }
            };
        }

        private static object[] Overbooking_From_Secondary_Port_Is_Not_Allowed() {
            // According to the schedule: Max persons = 185 (Corfu) + 215 (Lefkimmi) = 400
            // According to the reservations: Corfu (84) + Lefkimmi (50) = 134
            // Free seats = 400 - 134 = 266
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 433,
                    Date = "2021-10-01",
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 4,
                    Adults = 267,
                    TicketNo = "xxxxxx"
                }
            };
        }

        private static object[] Duplicate_Records_Are_Not_Allowed() {
            // Checking for Date, DestinationId, CustomeId and TicketNo
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 409,
                    Date = "2021-10-01",
                    CustomerId = 14,
                    DestinationId = 1,
                    PickupPointId = 285,
                    TicketNo = "SBQRQ"
                }
            };
        }

        private static object[] Customer_Must_Exist() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 450,
                    Date = "2021-10-01",
                    CustomerId = 99,
                    DestinationId = 1,
                    PickupPointId = 285,
                    TicketNo = "xxxxxx"
                }
            };
        }

        private static object[] Customer_Must_Be_Active() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 450,
                    Date = "2021-10-01",
                    CustomerId = 20,
                    DestinationId = 1,
                    PickupPointId = 285,
                    TicketNo = "xxxxxx"
                }
            };
        }

        private static object[] Destination_Must_Exist() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 451,
                    Date = "2021-10-01",
                    CustomerId = 1,
                    DestinationId = 99,
                    PickupPointId = 285,
                    Adults = 2,
                    TicketNo = "xxxxx"
                }
            };
        }

        private static object[] Destination_Must_Be_Active() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 451,
                    Date = "2021-10-01",
                    CustomerId = 1,
                    DestinationId = 4,
                    PickupPointId = 285,
                    Adults = 2,
                    TicketNo = "xxxxx"
                }
            };
        }

        private static object[] PickupPoint_Must_Exist() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 452,
                    Date = "2021-10-01",
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 999,
                    Adults = 2,
                    TicketNo = "xxxxx"
                }
            };
        }

        private static object[] PickupPoint_Must_Be_Active() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 452,
                    Date = "2021-10-01",
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 336,
                    Adults = 2,
                    TicketNo = "xxxxx"
                }
            };
        }

        private static object[] Driver_Must_Exist() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 453,
                    CustomerId = 1,
                    DestinationId = 1,
                    DriverId = 99,
                    PickupPointId = 3,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 3,
                }
            };
        }

        private static object[] Driver_Must_Be_Active() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 453,
                    CustomerId = 1,
                    DestinationId = 1,
                    DriverId = 5,
                    PickupPointId = 3,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 3,
                }
            };
        }

        private static object[] Ship_Must_Exist() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 454,
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    ShipId = 99,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 3,
                }
            };
        }

        private static object[] Ship_Must_Be_Active() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 454,
                    CustomerId = 1,
                    DestinationId = 1,
                    ShipId = 2,
                    PickupPointId = 3,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 3,
                }
            };
        }

        private static object[] Passenger_Count_Is_Not_Correct() {
            return new object[]{
                new TestReservation{
                    FeatureUrl = "/reservations/",
                    StatusCode = 455,
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 2,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 123, OccupantId = 2, GenderId = 1 },
                        new TestPassenger { Lastname = "ALONA", Firstname = "CUTLER", Birthdate = "1964-04-28", NationalityId = 127, OccupantId = 2, GenderId = 2 },
                        new TestPassenger { Lastname = "LYA", Firstname = "TROWBRIDGE", Birthdate = "2015-01-21", NationalityId = 211, OccupantId = 2, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Nationality_Must_Exist() {
            return new object[]{
                new TestReservation{
                    FeatureUrl = "/reservations/",
                    StatusCode = 456,
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 2,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 999, OccupantId = 2, GenderId = 3 },
                    }
                }
            };
        }

        private static object[] Nationality_Must_Be_Active() {
            return new object[]{
                new TestReservation{
                    FeatureUrl = "/reservations/",
                    StatusCode = 456,
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 2,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 3, OccupantId = 2, GenderId = 3 },
                    }
                }
            };
        }

        private static object[] Gender_Must_Exist() {
            return new object[]{
                new TestReservation{
                    FeatureUrl = "/reservations/",
                    StatusCode = 457,
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 2,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 1, OccupantId = 2, GenderId = 5 },
                    }
                }
            };
        }

        private static object[] Gender_Must_Be_Active() {
            return new object[]{
                new TestReservation{
                    FeatureUrl = "/reservations/",
                    StatusCode = 457,
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 2,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 1, OccupantId = 2, GenderId = 3 },
                    }
                }
            };
        }

        private static object[] Occupant_Must_Exist() {
            return new object[]{
                new TestReservation{
                    FeatureUrl = "/reservations/",
                    StatusCode = 458,
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 2,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 1, OccupantId = 4, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Occupant_Must_Be_Active() {
            return new object[]{
                new TestReservation{
                    FeatureUrl = "/reservations/",
                    StatusCode = 458,
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    Date = "2021-10-01",
                    TicketNo = "xxxx",
                    Adults = 2,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 1, OccupantId = 3, GenderId = 1 },
                    }
                }
            };
        }

    }

}
