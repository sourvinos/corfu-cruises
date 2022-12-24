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

        [Authorize(Roles = "admin")]
        public async Task<EmbarkationFinalGroupVM> GetAsync([FromQuery(Name = "date")] string date, [FromQuery(Name = "destinationId")] int[] destinationIds, [FromQuery(Name = "portId")] int[] portIds, [FromQuery(Name = "shipId")] int?[] shipIds) {
            return await repo.GetAsync(date, destinationIds, portIds, shipIds);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> EmbarkPassenger([FromRoute] int id) {
            var x = await repo.GetPassengerByIdAsync(id);
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