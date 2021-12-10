using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlueWaterCruises.Features.Manifest {

    [Route("api/[controller]")]

    public class ManifestController : ControllerBase {

        private readonly IManifestRepository repo;

        public ManifestController(IManifestRepository repo) {
            this.repo = repo;
        }

        [Authorize]
        [HttpGet("date/{date}/destinationId/{destinationId}/portId/{portId}/vesselId/{vesselId}")]
        public ManifestResource Get(string date, int destinationId, int portId, int vesselId) {
            return this.repo.Get(date, destinationId, portId, vesselId);
        }

    }

}