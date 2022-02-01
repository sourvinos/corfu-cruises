using System.Collections;
using System.Collections.Generic;

namespace API.Integration.Tests.Vouchers {

    public class NewVoucher : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Admins_Can_Create_Vouchers();
            yield return Simple_Users_Can_Create_Vouchers();
        }

        private static object[] Admins_Can_Create_Vouchers() {
            return new object[] {
                new TestVoucher {
                    TicketNo = "TUI1701",
                    TotalPersons = 2,
                    Email = "johnsourvinos@hotmail.com"
                }
            };
        }

        private static object[] Simple_Users_Can_Create_Vouchers() {
            return new object[] {
                new TestVoucher {
                    TicketNo = "SUNSPOTS74656",
                    TotalPersons = 4,
                    Email = "gatopoulidis@gmail.com"
                }
            };
        }

    }

}
