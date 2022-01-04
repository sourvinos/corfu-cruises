using System.Collections;
using System.Collections.Generic;
using BackEnd.UnitTests.Infrastructure;
using API.Features.Ships.Base;

namespace BackEnd.UnitTests.Ships.Base {

    public class ValidateAgent : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Agent_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Agent_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new ShipWriteResource {
                    Agent = Helpers.GetLongString()
                }
            };
        }

    }

}
