using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlueWaterCruises.Features.Embarkation {

    [Route("api/[controller]")]
    public class EmbarkationsController : ControllerBase {

        private readonly IEmbarkationRepository repo;
        public EmbarkationsController(IEmbarkationRepository repo) {
            this.repo = repo;
        }

        [HttpGet("date/{date}/destinationId/{destinationId}/portId/{portId}/shipId/{shipId}")]
        [Authorize(Roles = "admin")]
        public async Task<EmbarkationMainResultResource<EmbarkationResource>> Get(string date, int destinationId, int portId, int shipId) {
            return await this.repo.Get(date, destinationId, portId, shipId);
        }

        [HttpPatch("doEmbarkation")]
        [Authorize(Roles = "admin")]
        public IActionResult DoEmbarkation(int id) {
            if (repo.DoEmbarkation(id)) {
                return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
            } else {
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
        }

    }

}