using System.Collections;
using System.Collections.Generic;
using BlueWaterCruises.Features.Reservations;

namespace BackEnd.UnitTests.Reservations {

    public class InvalidDate : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Date_Can_Not_Be_Empty();
            yield return Date_Can_Not_Be_Null();
            yield return Date_Can_Not_Be_Longer_Than_Maximum();
            yield return Date_Is_Invalid_When_Year_Is_Not_Leap();
            yield return Date_Is_Invalid_When_Not_Greater_Than_Today();
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

        private static object[] Date_Is_Invalid_When_Year_Is_Not_Leap() {
            return new object[] {
                new ReservationWriteResource {
                    Date = "2021-02-29"
                }
            };
        }

        private static object[] Date_Is_Invalid_When_Not_Greater_Than_Today() {
            return new object[] {
                new ReservationWriteResource {
                    Date = "2021-12-01"
                }
            };
        }

    }

}
