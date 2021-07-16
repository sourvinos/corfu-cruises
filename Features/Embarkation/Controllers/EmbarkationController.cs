using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace ShipCruises {

    // [Authorize]
    [Route("api/[controller]")]

    public class EmbarkationsController : ControllerBase {

        private readonly IEmbarkationRepository repo;
        private readonly ILogger<EmbarkationsController> logger;
        private readonly IMapper mapper;

        public EmbarkationsController(IEmbarkationRepository repo, ILogger<EmbarkationsController> logger, IMapper mapper) {
            this.repo = repo;
            this.logger = logger;
            this.mapper = mapper;
        }

        [HttpGet("date/{date}/destinationId/{destinationId}/portId/{portId}/shipId/{shipId}")]
        public async Task<EmbarkationMainResultResource<EmbarkationResource>> Get(string date, int destinationId, int portId, int shipId) {
            return await this.repo.Get(date, destinationId, portId, shipId);
        }

        [HttpPatch("doEmbarkation")]
        public IActionResult DoEmbarkation(int id) {
            try {
                if (this.repo.DoEmbarkation(id)) {
                    return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
                } else {
                    throw new DbUpdateException();
                }
            } catch (DbUpdateException exception) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, exception);
                return StatusCode(490, new {
                    response = ApiMessages.RecordNotSaved()
                });
            }
        }

    }

}