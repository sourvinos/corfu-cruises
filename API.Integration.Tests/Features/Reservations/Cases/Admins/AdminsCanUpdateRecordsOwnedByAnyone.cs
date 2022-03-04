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
                    ReservationId = Guid.Parse("08d9fda0-8868-4b45-882f-c0a8c3d865b9"),
                    Date = "2022-03-01",
                    CustomerId = 3,
                    DestinationId = 1,
                    PickupPointId = 7,
                    TicketNo = "xxxx2"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_Owned_By_Other_Admins() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("f1529422-5619-4b8b-9bcd-4f0950752679"),
                    Date = "2022-03-02",
                    CustomerId = 5,
                    DestinationId = 3,
                    PickupPointId = 15,
                    TicketNo = "LDPCW"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_Owned_By_Simple_Users() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("cc939619-ced8-49a7-a330-9cd6b491cb93"),
                    Date = "2022-03-03",
                    CustomerId = 8,
                    DestinationId = 1,
                    PickupPointId = 273,
                    TicketNo = "CTRLX"
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
                    ReservationId = Guid.Parse("e5f7efbd-1539-459d-8743-6a1353607102"),
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
                    DestinationId = 3,
                    DriverId = 1,
                    PickupPointId = 65,
                    ShipId = 2,
                    TicketNo = "YYJZS"
                }
            };
        }

    }

}