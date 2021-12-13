using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Reservations {

    public class AdminCanDeleteRecordOwnedByAnyone : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Admins_Can_Delete_Own_Records();
            yield return Admins_Can_Delete_Record_Owned_By_Other_Admins();
            yield return Admins_Can_Delete_Records_Owned_By_Simple_Users();
        }

        private static object[] Admins_Can_Delete_Own_Records() {
            return new object[] {
                new ReservationBase {
                    FeatureUrl = "/reservations/",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ReservationId = "034464de-89bf-4828-b366-12671315dfba",
                    ExpectedResponseCode = 200
                }
            };
        }

        private static object[] Admins_Can_Delete_Record_Owned_By_Other_Admins() {
            return new object[] {
                new ReservationBase {
                    FeatureUrl = "/reservations/",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ReservationId = "3f12fe1e-56ad-45ff-894a-0e94d894875c",
                    ExpectedResponseCode = 200,
                }
            };
        }

        private static object[] Admins_Can_Delete_Records_Owned_By_Simple_Users() {
            return new object[] {
                new ReservationBase {
                    FeatureUrl = "/reservations/",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ReservationId = "6375f5ab-81ea-4d97-a9c6-f1c9de4c2c62",
                    ExpectedResponseCode = 200
                }
            };
        }

    }

}