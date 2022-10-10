using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.Billing {

    public interface IBillingRepository {

        Task<IEnumerable<BillingFinalVM>> Get(string fromDate, string toDate, string customerId, string destinationId, string shipId);

    }

}