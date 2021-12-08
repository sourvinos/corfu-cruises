using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests {

    public class AdminCanDeleteRecordOwnedByAnyone : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return this.Admin_Can_Delete_Own_Record();
            yield return this.Admin_Can_Delete_Record_Owned_By_Other_Admin();
            yield return this.Admin_Can_Delete_Record_Owned_By_Simple_User();
        }

        private object[] Admin_Can_Delete_Own_Record() {
            return new object[] {
                new ReservationBase {
                    FeatureUrl = "/reservations/",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ReservationId = "039e8f53-0ced-4974-bee6-3173f9cf02bd",
                    ExpectedResponseCode = 200
                }
            };
        }

        private object[] Admin_Can_Delete_Record_Owned_By_Other_Admin() {
            return new object[] {
                new ReservationBase {
                    FeatureUrl = "/reservations/",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ReservationId = "4c9946db-cb7c-4fa8-9c8c-69a49f946dc8",
                    ExpectedResponseCode = 200,
                }
            };
        }

        private object[] Admin_Can_Delete_Record_Owned_By_Simple_User() {
            return new object[] {
                new ReservationBase {
                    FeatureUrl = "/reservations/",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ReservationId = "5ca60aad-dc06-46ca-8689-9021d1595741",
                    ExpectedResponseCode = 200
                }
            };
        }

    }

}