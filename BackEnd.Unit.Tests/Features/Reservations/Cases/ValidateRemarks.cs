using System.Collections;
using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace BackEnd.UnitTests.Reservations {

    public class ValidateRemarks : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Remarks_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Remarks_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new ReservationWriteResource {
                    Remarks = Helpers.CreateRandomString(129)
                }
            };
        }

    }

}
