using System;
using System.Collections;
using System.Collections.Generic;

namespace API.Integration.Tests.Reservations {

    public class ActiveAdminsCanNotUpdateWhenInvalid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Nothing_For_This_Day();
            yield return Nothing_For_This_Day_And_Destination();
            yield return Nothing_For_This_Day_And_Destination_And_Port();
            yield return Overbooking_From_Primary_Port_With_No_Departures_From_Secondary_Port_Is_Not_Allowed();
            yield return Overbooking_From_Secondary_Port_With_No_Departures_From_Secondary_Port_Is_Not_Allowed();
            yield return Overbooking_From_Primary_Port_With_Departures_From_Secondary_Port_Is_Not_Allowed();
            yield return Overbooking_From_Secondary_Port_With_Departures_From_Secondary_Port_Is_Not_Allowed();
            yield return Duplicate_Records_Are_Not_Allowed();
            yield return Passenger_Count_Is_Not_Correct();
            yield return Customer_Must_Exist();
            yield return Destination_Must_Exist();
            yield return Driver_Must_Exist();
            yield return Gender_Must_Exist();
            yield return Nationality_Must_Exist();
            yield return Occupant_Must_Exist();
            yield return PickupPoint_Must_Exist();
            yield return Ship_Must_Exist();
        }

        private static object[] Nothing_For_This_Day() {
            return new object[] {
                new TestReservation {
                    StatusCode = 432,
                    ReservationId = Guid.Parse("08d9fda0-8868-4b45-882f-c0a8c3d865b9"),
                    CustomerId = 1,
                    DestinationId = 1,
                    DriverId = 1,
                    PickupPointId = 7,
                    PortId = 1,
                    ShipId = null,
                    Date = "2022-03-31",
                    RefNo = "PA61",
                    TicketNo = "xxxx2",
                    Adults = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 1, OccupantId = 2, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Nothing_For_This_Day_And_Destination() {
            return new object[] {
                new TestReservation {
                    StatusCode = 430,
                    ReservationId = Guid.Parse("08d9fda0-8868-4b45-882f-c0a8c3d865b9"),
                    CustomerId = 1,
                    DestinationId = 2,
                    DriverId = 1,
                    PickupPointId = 7,
                    PortId = 1,
                    ShipId = null,
                    Date = "2022-03-02",
                    RefNo = "PA61",
                    TicketNo = "xxxx2",
                    Adults = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 1, OccupantId = 2, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Nothing_For_This_Day_And_Destination_And_Port() {
            return new object[] {
                new TestReservation {
                    StatusCode = 427,
                    ReservationId = Guid.Parse("08d9fda0-8868-4b45-882f-c0a8c3d865b9"),
                    CustomerId = 1,
                    DestinationId = 1,
                    DriverId = 1,
                    PickupPointId = 266,
                    PortId = 1,
                    ShipId = null,
                    Date = "2022-06-06",
                    RefNo = "PA61",
                    TicketNo = "xxxx2",
                    Adults = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 1, OccupantId = 2, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Overbooking_From_Primary_Port_With_No_Departures_From_Secondary_Port_Is_Not_Allowed() {
            return new object[] {
                new TestReservation {
                    StatusCode = 433,
                    ReservationId = Guid.Parse("08d9fda0-8868-4b45-882f-c0a8c3d865b9"),
                    Date = "2022-03-01",
                    CustomerId = 3,
                    DestinationId = 1,
                    PickupPointId = 7,
                    Adults = 166,
                    TicketNo = "xxxxxx"
                }
            };
        }

        private static object[] Overbooking_From_Secondary_Port_With_No_Departures_From_Secondary_Port_Is_Not_Allowed() {
            return new object[] {
                new TestReservation {
                    StatusCode = 433,
                    ReservationId = Guid.Parse("08d9fd9f-4e99-4d51-8b55-c196f41c60e8"),
                    Date = "2022-03-01",
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 266,
                    Adults = 166,
                    TicketNo = "xxxxxx"
                }
            };
        }

        private static object[] Overbooking_From_Primary_Port_With_Departures_From_Secondary_Port_Is_Not_Allowed() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("0316855d-d5da-44a6-b09c-89a8d014a963"),
                    StatusCode = 433,
                    Date = "2022-03-02",
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 3,
                    Adults = 167,
                    TicketNo = "xxxxxx"
                }
            };
        }

        private static object[] Overbooking_From_Secondary_Port_With_Departures_From_Secondary_Port_Is_Not_Allowed() {
            return new object[] {
                new TestReservation {
                    StatusCode = 433,
                    ReservationId = Guid.Parse("08d9fcfd-a30b-4db2-8a1f-8190157d98a7"),
                    Date = "2022-03-02",
                    CustomerId = 1,
                    DestinationId = 1,
                    PickupPointId = 266,
                    Adults = 376,
                    TicketNo = "xxxxxx"
                }
            };
        }

        private static object[] Duplicate_Records_Are_Not_Allowed() {
            return new object[] {
                new TestReservation {
                    StatusCode = 409,
                    ReservationId = Guid.Parse("08d9fc2c-6043-42e4-832d-6e31295c206a"),
                    Date = "2022-03-02",
                    CustomerId = 16,
                    DestinationId = 1,
                    PickupPointId = 266,
                    TicketNo = "XBOTW"
                }
            };
        }

        private static object[] Customer_Must_Exist() {
            return new object[] {
                new TestReservation {
                    StatusCode = 450,
                    ReservationId = Guid.Parse("f1529422-5619-4b8b-9bcd-4f0950752679"),
                    CustomerId = 999,
                    DestinationId = 1,
                    DriverId = null,
                    PickupPointId = 15,
                    PortId = 1,
                    ShipId = 1,
                    Date = "2022-03-02",
                    RefNo = "BL48",
                    TicketNo = "LDPCW",
                    Adults = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 1, OccupantId = 1, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Destination_Must_Exist() {
            return new object[] {
                new TestReservation {
                    StatusCode = 451,
                    ReservationId = Guid.Parse("f1529422-5619-4b8b-9bcd-4f0950752679"),
                    CustomerId = 5,
                    DestinationId = 99,
                    DriverId = null,
                    PickupPointId = 15,
                    PortId = 1,
                    ShipId = 1,
                    Date = "2022-03-02",
                    RefNo = "BL48",
                    TicketNo = "LDPCW",
                    Adults = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 1, OccupantId = 1, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Driver_Must_Exist() {
            return new object[] {
                new TestReservation {
                    StatusCode = 453,
                    ReservationId = Guid.Parse("f1529422-5619-4b8b-9bcd-4f0950752679"),
                    CustomerId = 5,
                    DestinationId = 1,
                    DriverId = 99,
                    PickupPointId = 15,
                    PortId = 1,
                    ShipId = 1,
                    Date = "2022-03-02",
                    RefNo = "BL48",
                    TicketNo = "LDPCW",
                    Adults = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 1, OccupantId = 1, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Gender_Must_Exist() {
            return new object[] {
                new TestReservation {
                    StatusCode = 457,
                    ReservationId = Guid.Parse("f1529422-5619-4b8b-9bcd-4f0950752679"),
                    CustomerId = 5,
                    DestinationId = 1,
                    DriverId = null,
                    PickupPointId = 15,
                    PortId = 1,
                    ShipId = 1,
                    Date = "2022-03-02",
                    RefNo = "BL48",
                    TicketNo = "LDPCW",
                    Adults = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 1, OccupantId = 1, GenderId = 99 },
                    }
                }
            };
        }

        private static object[] Nationality_Must_Exist() {
            return new object[]{
                new TestReservation{
                    StatusCode = 456,
                    ReservationId = Guid.Parse("f1529422-5619-4b8b-9bcd-4f0950752679"),
                    CustomerId = 5,
                    DestinationId = 1,
                    DriverId = null,
                    PickupPointId = 15,
                    PortId = 1,
                    ShipId = 1,
                    Date = "2022-03-02",
                    RefNo = "BL48",
                    TicketNo = "LDPCW",
                    Adults = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 999, OccupantId = 1, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Occupant_Must_Exist() {
            return new object[] {
                new TestReservation {
                    StatusCode = 458,
                    ReservationId = Guid.Parse("f1529422-5619-4b8b-9bcd-4f0950752679"),
                    CustomerId = 5,
                    DestinationId = 1,
                    DriverId = null,
                    PickupPointId = 15,
                    PortId = 1,
                    ShipId = 1,
                    Date = "2022-03-02",
                    RefNo = "BL48",
                    TicketNo = "LDPCW",
                    Adults = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 1, OccupantId = 999, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] PickupPoint_Must_Exist() {
            return new object[] {
                new TestReservation{
                    StatusCode = 452,
                    ReservationId = Guid.Parse("f1529422-5619-4b8b-9bcd-4f0950752679"),
                    CustomerId = 5,
                    DestinationId = 1,
                    DriverId = null,
                    PickupPointId = 999,
                    PortId = 1,
                    ShipId = 1,
                    Date = "2022-03-02",
                    RefNo = "BL48",
                    TicketNo = "LDPCW",
                    Adults = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 1, OccupantId = 1, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Ship_Must_Exist() {
            return new object[] {
                new TestReservation{
                    StatusCode = 454,
                    ReservationId = Guid.Parse("f1529422-5619-4b8b-9bcd-4f0950752679"),
                    CustomerId = 5,
                    DestinationId = 1,
                    DriverId = null,
                    PickupPointId = 15,
                    PortId = 1,
                    ShipId = 99,
                    Date = "2022-03-02",
                    RefNo = "BL48",
                    TicketNo = "LDPCW",
                    Adults = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 1, OccupantId = 1, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Passenger_Count_Is_Not_Correct() {
            return new object[]{
                new TestReservation{
                    StatusCode = 455,
                    ReservationId = Guid.Parse("f1529422-5619-4b8b-9bcd-4f0950752679"),
                    CustomerId = 5,
                    DestinationId = 1,
                    PickupPointId = 15,
                    Date = "2022-03-02",
                    TicketNo = "LDPCW",
                    Adults = 2,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 123, OccupantId = 2, GenderId = 1 },
                        new TestPassenger { Lastname = "ALONA", Firstname = "CUTLER", Birthdate = "1964-04-28", NationalityId = 127, OccupantId = 2, GenderId = 2 },
                        new TestPassenger { Lastname = "LYA", Firstname = "TROWBRIDGE", Birthdate = "2015-01-21", NationalityId = 211, OccupantId = 2, GenderId = 1 },
                    }
                }
            };
        }

    }

}
