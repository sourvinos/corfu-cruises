using System.Collections.Generic;

namespace CorfuCruises {

    public interface IInvoicingRepository {

        IEnumerable<InvoicingReadResource> Get(string date);

    }

}