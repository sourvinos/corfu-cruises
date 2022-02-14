using System.Collections;
using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.IntegrationTests.ShipCrews {

    public class CreateInvalidCrew : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Gender_Must_Exist();
            yield return Gender_Must_Be_Active();
            yield return Gender_Must_Not_Be_Null();
            yield return Nationality_Must_Exist();
            yield return Nationality_Must_Be_Active();
            yield return Nationality_Must_Not_Be_Null();
            yield return Occupant_Must_Exist();
            yield return Occupant_Must_Be_Active();
            yield return Occupant_Must_Not_Be_Null();
            yield return Ship_Must_Exist();
            yield return Ship_Must_Be_Active();
            yield return Ship_Must_Not_Be_Null();
        }

        private static object[] Gender_Must_Exist() {
            return new object[] {
                new TestCrew {
                    StatusCode = 450,
                    GenderId = 5,
                    NationalityId = 1,
                    OccupantId = 1,
                    ShipId = 1,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01",
                }
            };
        }

        private static object[] Gender_Must_Be_Active() {
            return new object[] {
                new TestCrew {
                    StatusCode = 450,
                    GenderId = 3,
                    NationalityId = 1,
                    OccupantId = 1,
                    ShipId = 1,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01",
                }
            };
        }

        private static object[] Gender_Must_Not_Be_Null() {
            return new object[] {
                new TestCrew {
                    StatusCode = 450,
                    NationalityId = 1,
                    ShipId = 1,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01",
                }
            };
        }

        private static object[] Nationality_Must_Exist() {
            return new object[] {
                new TestCrew {
                    StatusCode = 451,
                    GenderId = 1,
                    NationalityId = 999,
                    ShipId = 1,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01",
                }
            };
        }

        private static object[] Nationality_Must_Be_Active() {
            return new object[] {
                new TestCrew {
                    StatusCode = 451,
                    GenderId = 1,
                    NationalityId = 3,
                    ShipId = 1,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01",
                }
            };
        }

        private static object[] Nationality_Must_Not_Be_Null() {
            return new object[] {
                new TestCrew {
                    StatusCode = 451,
                    GenderId = 1,
                    ShipId = 1,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01",
                }
            };
        }

        private static object[] Occupant_Must_Exist() {
            return new object[] {
                new TestCrew {
                    StatusCode = 452,
                    GenderId = 1,
                    NationalityId = 1,
                    OccupantId = 999,
                    ShipId = 4,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01"
                }
            };
        }

        private static object[] Occupant_Must_Be_Active() {
            return new object[] {
                new TestCrew {
                    StatusCode = 452,
                    GenderId = 1,
                    NationalityId = 1,
                    OccupantId = 3,
                    ShipId = 4,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01"
                }
            };
        }

        private static object[] Occupant_Must_Not_Be_Null() {
            return new object[] {
                new TestCrew {
                    StatusCode = 452,
                    GenderId = 1,
                    NationalityId = 1,
                    ShipId = 4,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01"
                }
            };
        }

        private static object[] Ship_Must_Exist() {
            return new object[] {
                new TestCrew {
                    StatusCode = 453,
                    GenderId = 1,
                    NationalityId = 1,
                    ShipId = 4,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01"
                }
            };
        }

        private static object[] Ship_Must_Be_Active() {
            return new object[] {
                new TestCrew {
                    StatusCode = 453,
                    GenderId = 1,
                    NationalityId = 1,
                    ShipId = 2,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01"
                }
            };
        }

        private static object[] Ship_Must_Not_Be_Null() {
            return new object[] {
                new TestCrew {
                    StatusCode = 453,
                    GenderId = 1,
                    NationalityId = 1,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01"
                }
            };
        }

    }

}
