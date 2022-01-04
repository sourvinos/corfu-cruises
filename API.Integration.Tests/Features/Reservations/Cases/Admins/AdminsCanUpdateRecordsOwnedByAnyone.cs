using System;
using System.Collections;
using System.Collections.Generic;

namespace API.IntegrationTests.Reservations {

    public class AdminsCanUpdateRecordsOwnedByAnyone : IEnumerable<object[]> {

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
                    ReservationId = Guid.Parse("ccadccd6-527d-4f93-b6f0-6e9222e9ce05"),
                    CustomerId = 17,
                    DestinationId = 1,
                    PickupPointId = 148,
                    Date = "2021-10-01",
                    TicketNo = "FQPPI"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_Owned_By_Other_Admins() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    ReservationId = Guid.Parse("3f12fe1e-56ad-45ff-894a-0e94d894875c"),
                    CustomerId = 10,
                    DestinationId = 1,
                    PickupPointId = 318,
                    Date = "2021-10-01",
                    TicketNo = "OHTTG"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_Owned_By_Simple_Users() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    ReservationId = Guid.Parse("1799014b-d046-4de9-87e4-ce9eed4f45e0"),
                    CustomerId = 19,
                    DestinationId = 1,
                    PickupPointId = 155,
                    Date = "2021-10-01",
                    TicketNo = "MDBEP"
                }
            };
        }

    }

}