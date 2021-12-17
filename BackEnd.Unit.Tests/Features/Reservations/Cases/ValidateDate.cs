using System.Collections;
using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace BackEnd.UnitTests.Reservations {

    public class ValidateDate : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Date_Can_Not_Be_Empty();
            yield return Date_Can_Not_Be_Null();
            yield return Date_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Date_Can_Not_Be_Empty() {
            return new object[] {
                new ReservationWriteResource {
                    Date = ""
                }
            };
        }

        private static object[] Date_Can_Not_Be_Null() {
            return new object[] {
                new ReservationWriteResource {
                    Date = null
                }
            };
        }

        private static object[] Date_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new ReservationWriteResource {
                    Date = Helpers.CreateRandomString(11)
                }
            };
        }

    }

}
