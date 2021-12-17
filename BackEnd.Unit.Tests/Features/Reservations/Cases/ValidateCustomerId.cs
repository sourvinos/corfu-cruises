using System.Collections;
using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace BackEnd.UnitTests.Reservations {

    public class ValidateCustomerId : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return CustomerId_Can_Not_Be_Zero();
        }

        private static object[] CustomerId_Can_Not_Be_Zero() {
            return new object[] {
                new ReservationWriteResource {
                    CustomerId = 0
                }
            };
        }

    }

}
