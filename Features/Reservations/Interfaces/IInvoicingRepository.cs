using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IInvoicingRepository {

        List<Reservation> Get(string date);

    }

}