using System.Collections;
using System.Collections.Generic;
using BackEnd.UnitTests.Infrastructure;
using API.Features.Ships.Crews;

namespace BackEnd.UnitTests.Ships.Crews {

    public class ValidateFirstname : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Firstname_Can_Not_Be_Null();
            yield return Firstname_Can_Not_Be_Empty();
            yield return Firstname_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Firstname_Can_Not_Be_Null() {
            return new object[] {
                new CrewWriteResource {
                    Firstname = null
                }
            };
        }

        private static object[] Firstname_Can_Not_Be_Empty() {
            return new object[] {
                new CrewWriteResource {
                    Firstname = ""
                }
            };
        }

        private static object[] Firstname_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new CrewWriteResource {
                    Firstname = Helpers.GetLongString()
                }
            };
        }

    }

}
