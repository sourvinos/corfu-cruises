using System.Collections.Generic;

namespace API.Features.Invoicing {

    public interface IInvoicingRepository {

        IEnumerable<InvoiceIntermediateVM> Get(string date, string customerId, string destinationId, string shipId);

    }

}