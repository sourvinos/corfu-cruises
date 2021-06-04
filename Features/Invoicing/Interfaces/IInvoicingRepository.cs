using System.Collections.Generic;

namespace CorfuCruises {

    public interface IInvoicingRepository {

        IEnumerable<InvoiceViewModel> Get(string date);

    }

}