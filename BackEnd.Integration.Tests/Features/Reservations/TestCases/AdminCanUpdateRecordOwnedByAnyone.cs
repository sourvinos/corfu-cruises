using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests {

    public class AdminCanUpdateRecordOwnedByAnyone : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Admin_Can_Update_Own_Record();
            yield return Admin_Can_Update_Record_Owned_By_Other_Admin();
            yield return Admin_Can_Update_Record_Owned_By_Simple_User();
        }

        private static object[] Admin_Can_Update_Own_Record() {
            return new object[] {
                new Reservation {
                    FeatureUrl = "/reservations/",
                    ReservationId = "039e8f53-0ced-4974-bee6-3173f9cf02bd",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ExpectedResponseCode = 200,
                    Date = "2021-10-01",
                    DestinationId = 1,
                    CustomerId = 1,
                    PortId = 1,
                    Adults = 3,
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] Admin_Can_Update_Record_Owned_By_Other_Admin() {
            return new object[] {
                new Reservation {
                    FeatureUrl = "/reservations/",
                    ReservationId = "4c9946db-cb7c-4fa8-9c8c-69a49f946dc8",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ExpectedResponseCode = 200,
                    Date = "2021-10-01",
                    DestinationId = 1,
                    CustomerId = 1,
                    PortId = 1,
                    Adults = 3,
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] Admin_Can_Update_Record_Owned_By_Simple_User() {
            return new object[] {
                new Reservation {
                    FeatureUrl = "/reservations/",
                    ReservationId = "5ca60aad-dc06-46ca-8689-9021d1595741",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ExpectedResponseCode = 200,
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