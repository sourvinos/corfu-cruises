using System.Collections.Generic;

namespace API.Features.Invoicing.Display {

    public interface IInvoicingDisplayRepository {

        IEnumerable<InvoicingDisplayReportVM> Get(string date, string customerId, string destinationId, string shipId);

    }

}