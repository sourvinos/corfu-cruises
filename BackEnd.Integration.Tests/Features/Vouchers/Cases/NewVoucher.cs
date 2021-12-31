using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Vouchers {

    public class NewVoucher : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Admins_Can_Create_Vouchers();
            yield return Simple_Users_Can_Create_Vouchers();
        }

        private static object[] Admins_Can_Create_Vouchers() {
            return new object[] {
                new TestVoucher {
                    Username = "john",
                    Password = "ec11fc8c16da",
                    ExpectedResponseCode = 200,
                    ActionUrl = "/create",
                    TicketNo = "TUI1701",
                    TotalPersons = 2,
                    Email = "johnsourvinos@hotmail.com"
                }
            };
        }

        private static object[] Simple_Users_Can_Create_Vouchers() {
            return new object[] {
                new TestVoucher {
                    Username = "matoula",
                    Password = "820343d9e828",
                    ExpectedResponseCode = 200,
                    ActionUrl = "/create",
                    TicketNo = "SUNSPOTS74656",
                    TotalPersons = 4,
                    Email = "gatopoulidis@gmail.com"
                }
            };
        }

    }

}
