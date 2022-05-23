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
                    ReservationId = Guid.Parse("08da3187-afd4-4df3-8675-72360bf1ec90")
                }
            };
        }

        private static object[] Active_Admins_Can_Delete_Records_Owned_By_Other_Admins() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("08da31a2-0d53-4306-86fb-5fe2af9d9fcf")
                }
            };
        }

        private static object[] Active_Admins_Can_Delete_Records_Owned_By_Simple_Users() {
            return new object[] {
                new TestReservation {
                    ReservationId = Guid.Parse("6a3f5493-c495-4740-ae80-fa2cd7b8697a")
                }
            };
        }

    }

}