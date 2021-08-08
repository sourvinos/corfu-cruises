using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ShipCruises.Manifest {

    // [Authorize]
    [Route("api/[controller]")]

    public class ManifestController : ControllerBase {

        private readonly IManifestRepository repo;
        private readonly IEmailSender emailSender;
        private readonly ILogger<ManifestController> logger;
        private readonly IMapper mapper;
        private readonly DbContext context;

        public ManifestController(IManifestRepository repo, IEmailSender emailSender, ILogger<ManifestController> logger, IMapper mapper, DbContext context) {
            this.repo = repo;
            this.emailSender = emailSender;
            this.logger = logger;
            this.mapper = mapper;
            this.context = context;
        }

        [HttpGet("date/{date}/shipId/{shipId}/portId/{portId}")]
        public ManifestResource Get(string date, int shipId, int portId) {
            return this.repo.Get(date, shipId, portId);
        }
        // public ManifestViewModel Get(string date, int shipId, int portId) {
        //     return this.repo.Get(date, shipId, portId);
        // }

    }

}