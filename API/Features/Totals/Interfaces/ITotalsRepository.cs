using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.Totals {

    public interface ITotalsRepository {

        Task<IEnumerable<TotalsReportVM>> Get(string fromDate, string toDate);

    }

}