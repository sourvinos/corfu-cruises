using System;
using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Reservations {

    public class AdminCanUpdateRecordOwnedByAnyone : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Admins_Can_Update_Own_Records();
            yield return Admins_Can_Update_Records_Owned_By_Other_Admins();
            yield return Admins_Can_Update_Records_Owned_By_Simple_Users();
        }

        private static object[] Admins_Can_Update_Own_Records() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    ReservationId = Guid.Parse("039e8f53-0ced-4974-bee6-3173f9cf02bd"),
                    Date = "2021-10-01",
                    DestinationId = 1,
                    CustomerId = 1,
                    PortId = 1,
                    Adults = 3,
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_Owned_By_Other_Admins() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    ReservationId = Guid.Parse("4c9946db-cb7c-4fa8-9c8c-69a49f946dc8"),
                    Date = "2021-10-01",
                    DestinationId = 1,
                    CustomerId = 1,
                    PortId = 1,
                    Adults = 3,
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_Owned_By_Simple_Users() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    ReservationId = Guid.Parse("5ca60aad-dc06-46ca-8689-9021d1595741"),
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    Date = "2021-10-10",
                    DestinationId = 1,
                    CustomerId = 1,
                    PortId = 1,
                    Adults = 6,
                    TicketNo = "xxxx"
                }
            };
        }

    }

}