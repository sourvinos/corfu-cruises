using System.Collections.Generic;

namespace BlueWaterCruises.Features.Invoicing {

    public interface IInvoicingRepository {

        IEnumerable<InvoiceViewModel> Get(string date);
        IEnumerable<InvoiceViewModel> GetByDateAndCustomer(string date, int customerId);

    }

}