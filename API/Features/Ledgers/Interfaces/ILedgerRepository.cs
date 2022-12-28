using System.Collections.Generic;

namespace API.Features.Ledger {

    public interface ILedgerRepository {

        IEnumerable<LedgerFinalVM> Get(string fromDate, string toDate, int[] customerIds, int[] destinationIds, int?[] shipIds);

    }

}