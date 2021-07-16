using System.Collections.Generic;

namespace ShipCruises {

    public interface IInvoicingRepository {

        IEnumerable<InvoiceViewModel> Get(string date);
        IEnumerable<InvoiceViewModel> GetByDateAndCustomer(string date, int customerId);

    }

}