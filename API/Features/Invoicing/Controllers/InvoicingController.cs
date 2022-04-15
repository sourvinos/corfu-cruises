using System.Collections.Generic;
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

        [Authorize(Roles = "admin")]
        [HttpGet("date/{date}/customerId/{customerId}/destinationId/{destinationId}/shipId/{shipId}")]
        public IEnumerable<InvoicingReportVM> Get(string date, string customerId, string destinationId, string shipId) {
            return repo.Get(date, customerId, destinationId, shipId);
        }

    }

}