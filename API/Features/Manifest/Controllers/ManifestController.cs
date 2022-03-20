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

        [HttpGet("date/{date}/destinationId/{destinationId}/portId/{portId}/shipId/{shipId}/shipRouteId/{shipRouteId}")]
        [Authorize(Roles = "admin")]
        public ManifestResource Get(string date, int destinationId, int portId, int shipId, int shipRouteId) {
            return repo.Get(date, destinationId, portId, shipId, shipRouteId);
        }

    }

}