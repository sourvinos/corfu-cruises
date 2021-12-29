using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Extensions;
using BlueWaterCruises.Infrastructure.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BlueWaterCruises.Features.Ships.Routes {

    [Route("api/[controller]")]
    public class ShipRoutesController : ControllerBase {

        #region variables

        private readonly IShipRouteRepository repo;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        #endregion

        public ShipRoutesController(IShipRouteRepository repo, IHttpContextAccessor httpContext, IMapper mapper) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ShipRouteListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            return await repo.GetActiveForDropdown();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ShipRouteReadResource> GetShipRoute(int id) {
            return mapper.Map<ShipRoute, ShipRouteReadResource>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PostShipRoute([FromBody] ShipRouteWriteResource record) {
            repo.Create(mapper.Map<ShipRouteWriteResource, ShipRoute>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordCreated()
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PutShipRoute([FromBody] ShipRouteWriteResource record) {
            repo.Update(mapper.Map<ShipRouteWriteResource, ShipRoute>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordUpdated()
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteShipRoute([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private ShipRouteWriteResource AttachUserIdToRecord(ShipRouteWriteResource record) {
            record.UserId = Identity.GetConnectedUserId(httpContext);
            return record;
        }

    }

}