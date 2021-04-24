using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IInvoicingRepository {

        List<PersonsPerTransfer> Get(string date);

    }

}