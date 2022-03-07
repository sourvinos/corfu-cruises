using System;
using System.Collections;
using System.Collections.Generic;

namespace API.Integration.Tests.Reservations {

    public class ActiveAdminsCanDeleteOwnedByAnyone : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Active_Admins_Can_Delete_Own_Records();
            yield return Active_Admins_Can_Delete_Records_Owned_By_Other_Admins();
            yield return Active_Admins_Can_Delete_Records_Owned_By_Simple_Users();
        }

        private static object[] Active_Admins_Can_Delete_Own_Records() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("08d9fda0-8868-4b45-882f-c0a8c3d865b9")
                }
            };
        }

        private static object[] Active_Admins_Can_Delete_Records_Owned_By_Other_Admins() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("f1529422-5619-4b8b-9bcd-4f0950752679")
                }
            };
        }

        private static object[] Active_Admins_Can_Delete_Records_Owned_By_Simple_Users() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("cfd52799-621a-43c4-ad05-6cdd520818a8")
                }
            };
        }

    }

}