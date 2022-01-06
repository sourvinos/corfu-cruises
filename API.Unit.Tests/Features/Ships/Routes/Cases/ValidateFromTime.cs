using System.Collections;
using System.Collections.Generic;
using API.Features.Ships.Routes;

namespace API.UnitTests.Ships.Routes {

    public class ValidateFromTime : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return FromTime_Can_Not_Be_Null();
            yield return FromTime_Can_Not_Be_Empty();
            // yield return FromTime_Can_Not_Be_Invalid_First_Case();
            // yield return FromTime_Can_Not_Be_Invalid_Second_Case();
        }

        private static object[] FromTime_Can_Not_Be_Null() {
            return new object[] {
                new ShipRouteWriteResource {
                    FromTime = null
                }
            };
        }

        private static object[] FromTime_Can_Not_Be_Empty() {
            return new object[] {
                new ShipRouteWriteResource {
                    FromTime = ""
                }
            };
        }

    }

}
