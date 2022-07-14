using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ShipRoutes {

    [Route("api/[controller]")]
    public class ShipRoutesController : ControllerBase {

        #region variables

        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMapper mapper;
        private readonly IShipRouteRepository repo;

        #endregion

        public ShipRoutesController(IHttpContextAccessor httpContextAccessor, IMapper mapper, IShipRouteRepository repo) {
            this.httpContextAccessor = httpContextAccessor;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ShipRouteListDto>> Get() {
            return mapper.Map<IEnumerable<ShipRoute>, IEnumerable<ShipRouteListDto>>(await repo.Get());
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            return mapper.Map<IEnumerable<ShipRoute>, IEnumerable<SimpleResource>>(await repo.GetActiveForDropdown());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ShipRouteReadDto> GetShipRoute(int id) {
            return mapper.Map<ShipRoute, ShipRouteReadDto>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PostShipRouteAsync([FromBody] ShipRouteWriteDto record) {
            repo.Create(mapper.Map<ShipRouteWriteDto, ShipRoute>(await AttachUserIdToRecord(record)));
            return ApiResponses.OK();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PutShipRouteAsync([FromBody] ShipRouteWriteDto record) {
            repo.Update(mapper.Map<ShipRouteWriteDto, ShipRoute>(await AttachUserIdToRecord(record)));
            return ApiResponses.OK();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> DeleteShipRoute([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return ApiResponses.OK();
        }

        private async Task<ShipRouteWriteDto> AttachUserIdToRecord(ShipRouteWriteDto record) {
            var user = await Identity.GetConnectedUserId(httpContextAccessor);
            record.UserId = user.UserId;
            return record;
        }

    }

}