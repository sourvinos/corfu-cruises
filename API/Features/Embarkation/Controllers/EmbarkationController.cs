using System.Threading.Tasks;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
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
        public async Task<EmbarkationMappedGroupVM<EmbarkationMappedVM>> Get(string date, string destinationId, string portId, string shipId) {
            return await repo.Get(date, destinationId, portId, shipId);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> EmbarkPassenger([FromRoute] int id) {
            var x = await repo.GetPassengerById(id);
            if (x != null) {
                repo.EmbarkPassenger(id);
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        [HttpPatch("embarkPassengers")]
        [Authorize(Roles = "admin")]
        public Response EmbarkPassengers([FromQuery] int[] ids) {
            repo.EmbarkPassengers(ids);
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

    }

}