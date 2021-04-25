using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IInvoicingRepository {

        Task<IEnumerable<InvoicingReadResource>> Get(string date);

    }

}