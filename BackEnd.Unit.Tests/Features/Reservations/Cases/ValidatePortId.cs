using System.Collections;
using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace BackEnd.UnitTests.Reservations {

    public class ValidatePortId : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return PortId_Can_Not_Be_Zero();
        }

        private static object[] PortId_Can_Not_Be_Zero() {
            return new object[] {
                new ReservationWriteResource {
                    PortId = 0
                }
            };
        }

    }

}
