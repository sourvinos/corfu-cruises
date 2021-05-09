using System.Collections.Generic;

namespace CorfuCruises {

    public interface IInvoicingRepository {

        IEnumerable<InvoicingReservationViewModel> Get(string date);

    }

}