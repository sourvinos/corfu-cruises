using System.Collections.Generic;

namespace API.Features.Invoicing {

    public interface IInvoicingRepository {

        IEnumerable<InvoicingReportVM> Get(string fromDate, string toDate, string customerId, string destinationId, string shipId);

    }

}