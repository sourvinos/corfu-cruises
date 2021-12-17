using System.Collections;
using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace BackEnd.UnitTests.Reservations {

    public class InvalidPhones : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Phones_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Phones_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new ReservationWriteResource {
                    Phones = Helpers.CreateRandomString(129)
                }
            };
        }

    }

}
