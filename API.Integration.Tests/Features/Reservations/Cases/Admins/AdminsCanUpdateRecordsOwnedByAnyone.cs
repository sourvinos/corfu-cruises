using System;
using System.Collections;
using System.Collections.Generic;

namespace API.Integration.Tests.Reservations {

    public class AdminsCanUpdate : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Admins_Can_Update_Own_Records();
            yield return Admins_Can_Update_Records_Owned_By_Other_Admins();
            yield return Admins_Can_Update_Records_Owned_By_Simple_Users();
            yield return Admins_Can_Update_Records_With_Inactive_Customer();
            yield return Admins_Can_Update_Records_With_Inactive_Destination();
            yield return Admins_Can_Update_Records_With_Inactive_Driver();
            yield return Admins_Can_Update_Records_With_Inactive_PickupPoint();
            yield return Admins_Can_Update_Records_With_Inactive_Ship();
        }

        private static object[] Admins_Can_Update_Own_Records() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("ccadccd6-527d-4f93-b6f0-6e9222e9ce05"),
                    Date = "2022-02-01",
                    CustomerId = 17,
                    DestinationId = 1,
                    PickupPointId = 148,
                    TicketNo = "FQPPI"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_Owned_By_Other_Admins() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("3f12fe1e-56ad-45ff-894a-0e94d894875c"),
                    Date = "2022-02-01",
                    CustomerId = 10,
                    DestinationId = 1,
                    PickupPointId = 318,
                    TicketNo = "OHTTG"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_Owned_By_Simple_Users() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("1799014b-d046-4de9-87e4-ce9eed4f45e0"),
                    Date = "2022-02-01",
                    CustomerId = 19,
                    DestinationId = 1,
                    PickupPointId = 155,
                    TicketNo = "MDBEP"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_With_Inactive_Customer() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("034464de-89bf-4828-b366-12671315dfba"),
                    Date = "2022-02-01",
                    CustomerId = 20,
                    DestinationId = 1,
                    PickupPointId = 285,
                    TicketNo = "SBQRQ"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_With_Inactive_Destination() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("0316855d-d5da-44a6-b09c-89a8d014a963"),
                    Date = "2022-02-02",
                    CustomerId = 1,
                    DestinationId = 3,
                    PickupPointId = 65,
                    TicketNo = "ETTUU"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_With_Inactive_Driver() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("0b17ecc7-7318-4d4e-a950-8e1184809fe3"),
                    Date = "2022-02-01",
                    CustomerId = 8,
                    DestinationId = 1,
                    DriverId = 5,
                    PickupPointId = 285,
                    TicketNo = "RYFYH"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_With_Inactive_PickupPoint() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("92adf63c-773d-42ae-aa7b-f9bd25c9438f"),
                    Date = "2022-02-01",
                    CustomerId = 13,
                    DestinationId = 1,
                    DriverId = 2,
                    PickupPointId = 338,
                    TicketNo = "GPDVJ"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_With_Inactive_Ship() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("f7cd3311-e223-4527-bd10-905b9a738f94"),
                    Date = "2022-02-01",
                    CustomerId = 7,
                    DestinationId = 1,
                    DriverId = 2,
                    PickupPointId = 338,
                    TicketNo = "YYJZS"
                }
            };
        }

    }

}