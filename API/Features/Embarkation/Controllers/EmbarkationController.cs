using System.Threading.Tasks;
using API.Infrastructure.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Embarkation {

    [Route("api/[controller]")]
    public class EmbarkationController : ControllerBase {

        #region variables

        private readonly IEmbarkationRepository repo;

        public EmbarkationController(IEmbarkationRepository repo) {
            this.repo = repo;
        }

        #endregion

        [HttpGet("date/{date}/destinationId/{destinationId}/portId/{portId}/shipId/{shipId}")]
        [Authorize(Roles = "admin")]
        public async Task<EmbarkationGroupVM<EmbarkationVM>> Get(string date, int destinationId, int portId, string shipId) {
            return await repo.Get(date, destinationId, portId, shipId);
        }

        [HttpGet("[action]/{description}")]
        public async Task<int> GetShipIdFromDescription(string description) {
            return await repo.GetShipIdFromDescription(description);
        }

        [HttpPatch("embarkSinglePassenger")]
        [Authorize(Roles = "admin")]
        public IActionResult EmbarkSinglePassenger(int id) {
            if (repo.EmbarkSinglePassenger(id)) {
                return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
            } else {
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
        }

        [HttpPatch("embarkAllPassengers")]
        [Authorize(Roles = "admin")]
        public IActionResult EmbarkAllPassengers([FromQuery] int[] id) {
            if (repo.EmbarkAllPassengers(id)) {
                return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
            } else {
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
        }

    }

}