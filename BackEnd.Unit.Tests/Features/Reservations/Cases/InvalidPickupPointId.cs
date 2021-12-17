using System.Collections;
using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace BackEnd.UnitTests.Reservations {

    public class InvalidPickupPointId : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return PickupPointId_Can_Not_Be_Zero();
        }

        private static object[] PickupPointId_Can_Not_Be_Zero() {
            return new object[] {
                new ReservationWriteResource {
                    PickupPointId = 0
                }
            };
        }

    }

}
