using System;
using System.Collections;
using System.Collections.Generic;

namespace API.Integration.Tests.Reservations {

    public class AdminsCanUpdateOwnedByAnyone : IEnumerable<object[]> {

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
                    ReservationId = Guid.Parse("08d9fda0-8868-4b45-882f-c0a8c3d865b9"),
                    Date = "2022-03-01",
                    CustomerId = 3,
                    DestinationId = 1,
                    PickupPointId = 7,
                    TicketNo = "xxxx2",
                    Adults = 155
                }
            };
        }

        private static object[] Admins_Can_Update_Records_Owned_By_Other_Admins() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("82930aed-059e-4215-8fd0-291f39ab4280"),
                    Date = "2022-06-03",
                    CustomerId = 3,
                    DestinationId = 1,
                    PickupPointId = 90,
                    TicketNo = "HWGTF"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_Owned_By_Simple_Users() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("7c258b3a-4455-46bd-b6f1-b13356cbae6e"),
                    Date = "2022-03-02",
                    CustomerId = 16,
                    DestinationId = 1,
                    PickupPointId = 120,
                    TicketNo = "XBOTW"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_With_Inactive_Customer() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("ddb9057b-39bd-43e8-9477-d97197603e50"),
                    Date = "2022-03-10",
                    CustomerId = 20,
                    DestinationId = 1,
                    PickupPointId = 285,
                    TicketNo = "OICYR"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_With_Inactive_Destination() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("08d9fcfd-a30b-4db2-8a1f-8190157d98a7"),
                    Date = "2022-06-01",
                    CustomerId = 5,
                    DestinationId = 5,
                    PickupPointId = 1,
                    TicketNo = "745A"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_With_Inactive_Driver() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("08d9fda0-8868-4b45-882f-c0a8c3d865b9"),
                    Date = "2022-03-01",
                    CustomerId = 3,
                    DestinationId = 1,
                    DriverId = 5,
                    PickupPointId = 7,
                    TicketNo = "xxxx2"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_With_Inactive_PickupPoint() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("ddb9057b-39bd-43e8-9477-d97197603e50"),
                    Date = "2022-03-10",
                    CustomerId = 20,
                    DestinationId = 1,
                    DriverId = 5,
                    PickupPointId = 23,
                    TicketNo = "OICYR"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_With_Inactive_Ship() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("0316855d-d5da-44a6-b09c-89a8d014a963"),
                    Date = "2022-03-02",
                    CustomerId = 1,
                    DestinationId = 1,
                    DriverId = 1,
                    PickupPointId = 65,
                    ShipId = 2,
                    TicketNo = "YYJZS"
                }
            };
        }

    }

}