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
        public async Task<EmbarkationGroupVM<EmbarkationVM>> Get(string date, string destinationId, string portId, string shipId) {
            return await repo.Get(date, destinationId, portId, shipId);
        }

        [HttpGet("[action]/{description}")]
        public async Task<int> GetShipIdFromDescription(string description) {
            return await repo.GetShipIdFromDescription(description);
        }

        [HttpPatch("embarkSinglePassenger")]
        [Authorize(Roles = "admin")]
        public async Task<Response> EmbarkSinglePassenger(int id) {
            var passenger = await repo.GetPassengerById(id, false);
            if (passenger == null) {
                return new Response {
                    Code = 404,
                    Icon = Icons.Error.ToString(),
                    Message = ApiMessages.RecordNotFound()
                };
            } else {
                repo.EmbarkSinglePassenger(id);
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            }
        }

        [HttpPatch("embarkAllPassengers")]
        [Authorize(Roles = "admin")]
        public async Task<Response> EmbarkAllPassengers([FromQuery] int[] id) {
            repo.EmbarkAllPassengers(id);
            if (await CheckAllPassengersExist(id)) {
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            } else {
                return new Response {
                    Code = 404,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.EmbarkedPassengerWasNotFound()
                };
            };
        }

        private async Task<bool> CheckAllPassengersExist(int[] id) {
            foreach (var passengerId in id) {
                var passenger = await repo.GetPassengerById(passengerId, false);
                if (passenger == null) {
                    return false;
                }
            }
            return true;
        }

    }

}