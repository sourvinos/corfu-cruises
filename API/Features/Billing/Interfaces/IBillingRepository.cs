using System.Collections.Generic;

namespace API.Features.Billing {

    public interface IBillingRepository {

        IEnumerable<BillingFinalVM> Get(string fromDate, string toDate, string customerId, string destinationId, string shipId);

    }

}