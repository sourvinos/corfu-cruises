using System.Collections.Generic;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises.Features.Invoicing {

    // [Authorize]
    [Route("api/[controller]")]

    public class InvoicingController : ControllerBase {

        private readonly IInvoicingRepository repo;
        private readonly IEmailSender emailSender;
        private readonly ILogger<InvoicingController> logger;
        private readonly IMapper mapper;

        public InvoicingController(IInvoicingRepository repo, IEmailSender emailSender, ILogger<InvoicingController> logger, IMapper mapper) {
            this.repo = repo;
            this.emailSender = emailSender;
            this.logger = logger;
            this.mapper = mapper;
        }

        [HttpGet("date/{date}/customer/{customerId}/destination/{destinationId}/vessel/{vesselId}")]
        // [Authorize(Roles = "admin")]
        public IEnumerable<InvoiceViewModel> Get(string date, string customerId, string destinationId, string vesselId) {
            return this.repo.Get(date, customerId, destinationId, vesselId);
        }

    }

}