using System.Collections;
using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace BackEnd.UnitTests.Reservations {

    public class ValidateDestinationId : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return DestinationId_Can_Not_Be_Zero();
        }

        private static object[] DestinationId_Can_Not_Be_Zero() {
            return new object[] {
                new ReservationWriteResource {
                    DestinationId = 0
                }
            };
        }

    }

}
