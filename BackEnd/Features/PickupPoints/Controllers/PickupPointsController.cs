using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Infrastructure.Extensions;
using BlueWaterCruises.Infrastructure.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BlueWaterCruises.Features.PickupPoints {

    [Route("api/[controller]")]
    public class PickupPointsController : ControllerBase {

        #region variables

        private readonly IPickupPointRepository repo;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        #endregion

        public PickupPointsController(IPickupPointRepository repo, IHttpContextAccessor httpContext, IMapper mapper) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<PickupPointListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<PickupPointWithPortDropdownResource>> GetActiveWithPortForDropdown() {
            return await repo.GetActiveWithPortForDropdown();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<PickupPointReadResource> GetPickupPoint(int id) {
            return await repo.GetById(id);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PostPickupPoint([FromBody] PickupPointWriteResource record) {
            repo.Create(mapper.Map<PickupPointWriteResource, PickupPoint>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordCreated()
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PutPickupPoint([FromBody] PickupPointWriteResource record) {
            repo.Update(mapper.Map<PickupPointWriteResource, PickupPoint>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordUpdated()
            });
        }

        [HttpPatch("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> PatchPickupPoint([FromQuery(Name = "id")] int id, [FromQuery(Name = "coordinates")] string coordinates) {
            await repo.GetById(id);
            repo.UpdateCoordinates(id, coordinates);
            return StatusCode(200, new {
                response = ApiMessages.RecordUpdated()
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeletePickupPoint([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private PickupPointWriteResource AttachUserIdToRecord(PickupPointWriteResource record) {
            record.UserId = Identity.GetConnectedUserId(httpContext);
            return record;
        }

    }

}