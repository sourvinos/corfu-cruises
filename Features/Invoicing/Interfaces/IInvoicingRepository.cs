using System.Collections.Generic;

namespace CorfuCruises {

    public interface IInvoicingRepository {

        IEnumerable<InvoiceViewModel> Get(string date);
        IEnumerable<InvoiceViewModel> GetByDateAndCustomer(string date, int customerId);

    }

}