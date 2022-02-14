using System.Collections.Generic;

namespace API.Features.Invoicing {

    public interface IInvoicingRepository {

        // IEnumerable<InvoiceIntermediateViewModel> Get(string date, string customerId, string destinationId, string shipId);
        IEnumerable<InvoiceViewModel> Get(string date, string customerId, string destinationId, string shipId);

    }

}