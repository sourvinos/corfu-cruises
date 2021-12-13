using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Extensions;
using BlueWaterCruises.Infrastructure.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises.Features.Embarkation {

    [Route("api/[controller]")]
    public class EmbarkationsController : ControllerBase {

        private readonly IEmbarkationRepository repo;
        private readonly ILogger<EmbarkationsController> logger;

        public EmbarkationsController(IEmbarkationRepository repo, ILogger<EmbarkationsController> logger) {
            this.repo = repo;
            this.logger = logger;
        }

        [HttpGet("date/{date}/destinationId/{destinationId}/portId/{portId}/shipId/{shipId}")]
        [Authorize(Roles = "admin")]
        public async Task<EmbarkationMainResultResource<EmbarkationResource>> Get(string date, int destinationId, int portId, int shipId) {
            return await this.repo.Get(date, destinationId, portId, shipId);
        }

        [HttpPatch("doEmbarkation")]
        [Authorize(Roles = "admin")]
        public IActionResult DoEmbarkation(int id) {
            try {
                if (this.repo.DoEmbarkation(id)) {
                    return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
                } else {
                    throw new DbUpdateException();
                }
            } catch (DbUpdateException exception) {
                id.LogException(logger, ControllerContext, null, exception);
                return StatusCode(490, new {
                    response = ApiMessages.RecordNotSaved()
                });
            }
        }

    }

}