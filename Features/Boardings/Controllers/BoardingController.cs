using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace CorfuCruises {

    [Authorize]
    [Route("api/[controller]")]

    public class BoardingsController : ControllerBase {

        private readonly IBoardingRepository repo;
        private readonly ILogger<BoardingsController> logger;
        private readonly IMapper mapper;

        public BoardingsController(IBoardingRepository repo, ILogger<BoardingsController> logger, IMapper mapper) {
            this.repo = repo;
            this.logger = logger;
            this.mapper = mapper;
        }

        [HttpGet("date/{date}/destinationId/{destinationId}/portId/{portId}/shipId/{shipId}")]
        public async Task<BoardingMainResultResource<BoardingResource>> Get(string date, int destinationId, int portId, int shipId) {
            return await this.repo.Get(date, destinationId, portId, shipId);
        }

        [HttpPatch("doBoarding")]
        public IActionResult DoBoarding(int id) {
            try {
                if (this.repo.DoBoarding(id)) {
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