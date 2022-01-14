using System.Collections;
using System.Collections.Generic;
using API.IntegrationTests.Infrastructure;

namespace API.IntegrationTests.Routes {

    public class AdminsCantCreateWhenInvalid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Port_Must_Exist();
            yield return Port_Must_Be_Active();
            yield return Description_Length_Must_Be_Within_Limits();
            yield return Abbreviation_Length_Must_Be_Within_Limits();
        }

        private static object[] Port_Must_Exist() {
            return new object[] {
                new TestRoute {
                    FeatureUrl = "/routes/",
                    StatusCode = 450,
                    PortId = 99,
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation = Helpers.CreateRandomString(10)
                }
            };
        }

        private static object[] Port_Must_Be_Active() {
            return new object[] {
                new TestRoute {
                    FeatureUrl = "/routes/",
                    StatusCode = 450,
                    PortId = 3,
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation = Helpers.CreateRandomString(10)
                }
            };
        }

        private static object[] Abbreviation_Length_Must_Be_Within_Limits() {
            return new object[] {
                new TestRoute {
                    FeatureUrl = "/routes/",
                    StatusCode = 400,
                    PortId = 1,
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation = Helpers.CreateRandomString(11)
                }
            };
        }

        private static object[] Description_Length_Must_Be_Within_Limits() {
            return new object[] {
                new TestRoute {
                    FeatureUrl = "/routes/",
                    StatusCode = 400,
                    PortId = 1,
                    Description = Helpers.CreateRandomString(129),
                    Abbreviation = Helpers.CreateRandomString(10)
                }
            };
        }

    }

}