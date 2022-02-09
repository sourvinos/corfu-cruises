using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Manifest {

    [Route("api/[controller]")]
    public class ManifestController : ControllerBase {

        #region variables

        private readonly IManifestRepository repo;

        #endregion

        public ManifestController(IManifestRepository repo) {
            this.repo = repo;
        }

        [HttpGet("date/{date}/destinationId/{destinationId}/portId/{portId}/vesselId/{vesselId}")]
        //[Authorize(Roles = "admin")]
        public ManifestResource Get(string date, int destinationId, int portId, int vesselId) {
            return this.repo.Get(date, destinationId, portId, vesselId);
        }

    }

}