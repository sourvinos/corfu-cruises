using System.Collections.Generic;

namespace BlueWaterCruises.Features.Invoicing {

    public interface IInvoicingRepository {

        IEnumerable<InvoiceViewModel> Get(string date, string customerId, string destinationId, string vesselId);

    }

}