using System.Collections;
using System.Collections.Generic;

namespace API.Integration.Tests.Vouchers {

    public class NewVoucher : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return New_Voucher();
        }

        private static object[] New_Voucher() {
            return new object[] {
                new TestVoucher {
                    TicketNo = "TUI1701",
                    TotalPersons = 2,
                    Email = "johnsourvinos@hotmail.com"
                }
            };
        }

    }

}
