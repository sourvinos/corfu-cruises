using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Infrastructure.Extensions;
using BlueWaterCruises.Infrastructure.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BlueWaterCruises.Features.Routes {

    [Route("api/[controller]")]
    public class RoutesController : ControllerBase {

        private readonly IRouteRepository repo;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        public RoutesController(IRouteRepository repo, IHttpContextAccessor httpContext, IMapper mapper) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<RouteListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IActionResult> GetActiveForDropdown() {
            return StatusCode(200, await repo.GetActiveForDropdown());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<RouteReadResource> GetRoute(int id) {
            return await repo.GetById(id);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PostRoute([FromBody] RouteWriteResource record) {
            repo.Create(mapper.Map<RouteWriteResource, Route>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordCreated()
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PutRoute([FromBody] RouteWriteResource record) {
            repo.Update(mapper.Map<RouteWriteResource, Route>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordUpdated()
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteRoute([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private RouteWriteResource AttachUserIdToRecord(RouteWriteResource record) {
            record.UserId = Identity.GetConnectedUserId(httpContext);
            return record;
        }

    }

}