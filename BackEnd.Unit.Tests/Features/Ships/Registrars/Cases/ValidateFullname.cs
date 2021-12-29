using System.Collections;
using System.Collections.Generic;
using BackEnd.UnitTests.Infrastructure;
using BlueWaterCruises.Features.Ships.Registrars;

namespace BackEnd.UnitTests.Ships.Registrars {

    public class ValidateFullname : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Fullname_Can_Not_Be_Null();
            yield return Fullname_Can_Not_Be_Empty();
            yield return Fullname_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Fullname_Can_Not_Be_Null() {
            return new object[] {
                new RegistrarWriteResource {
                    Fullname = null
                }
            };
        }

        private static object[] Fullname_Can_Not_Be_Empty() {
            return new object[] {
                new RegistrarWriteResource {
                    Fullname = ""
                }
            };
        }

        private static object[] Fullname_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new RegistrarWriteResource {
                    Fullname = Helpers.GetLongString()
                }
            };
        }

    }

}
