using System.Collections.Generic;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CorfuCruises {

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

        [HttpGet("date/{date}")]
        // [Authorize(Roles = "Admin")]
        public IEnumerable<InvoiceViewModel> Get(string date) {
            return this.repo.Get(date);
        }

        [HttpGet("date/{date}/customer/{customerId}")]
        // [Authorize(Roles = "Admin")]
        public IEnumerable<InvoiceViewModel> GetByDateAndCustomer(string date,int customerId) {
            return this.repo.GetByDateAndCustomer(date,customerId);
        }

    }

}