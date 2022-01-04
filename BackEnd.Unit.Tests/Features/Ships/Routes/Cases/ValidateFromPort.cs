using System.Collections;
using System.Collections.Generic;
using BackEnd.UnitTests.Infrastructure;
using API.Features.Ships.Routes;

namespace BackEnd.UnitTests.Ships.Routes {

    public class ValidateFromPort : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return FromPort_Can_Not_Be_Null();
            yield return FromPort_Can_Not_Be_Empty();
            yield return FromPort_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] FromPort_Can_Not_Be_Null() {
            return new object[] {
                new ShipRouteWriteResource {
                    FromPort = null
                }
            };
        }

        private static object[] FromPort_Can_Not_Be_Empty() {
            return new object[] {
                new ShipRouteWriteResource {
                    FromPort = ""
                }
            };
        }

        private static object[] FromPort_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new ShipRouteWriteResource {
                    FromPort = Helpers.GetLongString()
                }
            };
        }

    }

}
