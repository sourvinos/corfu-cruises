using System.Collections;
using System.Collections.Generic;
using BlueWaterCruises.Features.Customers;

namespace BackEnd.UnitTests.Customers {

    public class ValidateDescription : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Description_Can_Not_Be_Null();
            yield return Description_Can_Not_Be_Empty();
            yield return Description_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Description_Can_Not_Be_Null() {
            return new object[] {
                new CustomerWriteResource {
                    Description = null
                }
            };
        }

        private static object[] Description_Can_Not_Be_Empty() {
            return new object[] {
                new CustomerWriteResource {
                    Description = ""
                }
            };
        }

        private static object[] Description_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] {
                new CustomerWriteResource {
                    Description = Helpers.GetLongString()
                }
            };
        }

    }

}
