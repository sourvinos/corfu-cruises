using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Invoicing {

    [Route("api/[controller]")]
    public class InvoicingController : ControllerBase {

        #region variables

        private readonly IInvoicingRepository repo;

        #endregion

        public InvoicingController(IInvoicingRepository repo) {
            this.repo = repo;
        }

        [Authorize(Roles = "user, admin")]
        [HttpGet("fromDate/{fromDate}/toDate/{toDate}/customerId/{customerId}/destinationId/{destinationId}/shipId/{shipId}")]
        public Task<IEnumerable<InvoicingReportVM>> Get(string fromDate, string toDate, string customerId, string destinationId, string shipId) {
            return repo.Get(fromDate, toDate, customerId, destinationId, shipId);
        }

    }

}