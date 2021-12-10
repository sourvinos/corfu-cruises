using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlueWaterCruises.Features.Invoicing {

    // [Authorize]
    [Route("api/[controller]")]

    public class InvoicingController : ControllerBase {

        private readonly IInvoicingRepository repo;

        public InvoicingController(IInvoicingRepository repo) {
            this.repo = repo;
        }

        [HttpGet("date/{date}/customer/{customerId}/destination/{destinationId}/vessel/{vesselId}")]
        [Authorize(Roles = "admin")]
        public IEnumerable<InvoiceViewModel> Get(string date, string customerId, string destinationId, string vesselId) {
            return this.repo.Get(date, customerId, destinationId, vesselId);
        }

    }

}