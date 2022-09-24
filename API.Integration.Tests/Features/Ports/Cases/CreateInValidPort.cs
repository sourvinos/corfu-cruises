using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Ports {

    public class CreateInvalidPort : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return StopOrderLessThanOne();
            yield return StopOrderGreaterThanTen();
            yield return StopOrderNotUnique();
        }

        private static object[] StopOrderLessThanOne() {
            return new object[] {
                new TestPort {
                    StatusCode = 493,
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation= Helpers.CreateRandomString(5),
                    StopOrder = 0
                }
            };
        }

        private static object[] StopOrderGreaterThanTen() {
            return new object[] {
                new TestPort {
                    StatusCode = 493,
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation= Helpers.CreateRandomString(5),
                    StopOrder = 11
                }
            };
        }

        private static object[] StopOrderNotUnique() {
            return new object[] {
                new TestPort {
                    StatusCode = 493,
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation= Helpers.CreateRandomString(5),
                    StopOrder = 2
                }
            };
        }

    }

}
