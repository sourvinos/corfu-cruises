using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Invoicing.Display {

    [Route("api/[controller]")]
    public class InvoicingDisplayController : ControllerBase {

        #region variables

        private readonly IInvoicingDisplayRepository repo;

        #endregion

        public InvoicingDisplayController(IInvoicingDisplayRepository repo) {
            this.repo = repo;
        }

        [Authorize(Roles = "admin")]
        [HttpGet("date/{date}/customerId/{customerId}/destinationId/{destinationId}/shipId/{shipId}")]
        public IEnumerable<InvoicingDisplayReportVM> Get(string date, string customerId, string destinationId, string shipId) {
            return repo.Get(date, customerId, destinationId, shipId);
        }

    }

}