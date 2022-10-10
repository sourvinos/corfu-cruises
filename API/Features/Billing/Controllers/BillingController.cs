using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Billing {

    [Route("api/[controller]")]
    public class BillingController : ControllerBase {

        #region variables

        private readonly IBillingRepository repo;

        #endregion

        public BillingController(IBillingRepository repo) {
            this.repo = repo;
        }

        [Authorize(Roles = "user, admin")]
        [HttpGet("fromDate/{fromDate}/toDate/{toDate}/customerId/{customerId}/destinationId/{destinationId}/shipId/{shipId}")]
        public Task<IEnumerable<BillingFinalVM>> Get(string fromDate, string toDate, string customerId, string destinationId, string shipId) {
            return repo.Get(fromDate, toDate, customerId, destinationId, shipId);
        }

    }

}