using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    // [Authorize]
    [Route("api/[controller]")]

    public class ManifestController : ControllerBase {

        private readonly IManifestRepository repo;
        private readonly IEmailSender emailSender;
        private readonly ILogger<ManifestController> logger;
        private readonly IMapper mapper;

        public ManifestController(IManifestRepository repo, IEmailSender emailSender, ILogger<ManifestController> logger, IMapper mapper) {
            this.repo = repo;
            this.emailSender = emailSender;
            this.logger = logger;
            this.mapper = mapper;
        }

        [HttpGet("date/{date}/shipId/{shipId}/shipRouteId/{shipRouteId}")]
        public IEnumerable<ManifestViewModel> Get(string date, int shipId, int shipRouteId) {
            return this.repo.Get(date, shipId, shipRouteId);
        }

    }

}