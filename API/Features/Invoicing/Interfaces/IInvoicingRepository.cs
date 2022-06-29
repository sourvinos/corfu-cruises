using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.Invoicing {

    public interface IInvoicingRepository {

        Task<IEnumerable<InvoicingReportVM>> Get(string fromDate, string toDate, string customerId, string destinationId, string shipId);

    }

}