using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Infrastructure.Extensions;
using BlueWaterCruises.Infrastructure.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BlueWaterCruises.Features.Ships.Crews {

    [Route("api/[controller]")]
    public class CrewsController : ControllerBase {

        #region variables

        private readonly ICrewRepository repo;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        #endregion

        public CrewsController(ICrewRepository repo, IHttpContextAccessor httpContext, IMapper mapper) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<CrewListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<CrewReadResource> GetCrew(int id) {
            return await repo.GetById(id);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult Post([FromBody] CrewWriteResource record) {
            repo.Create(mapper.Map<CrewWriteResource, Crew>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordCreated()
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult Put([FromBody] CrewWriteResource record) {
            repo.Update(mapper.Map<CrewWriteResource, Crew>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordUpdated()
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteCrew([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private CrewWriteResource AttachUserIdToRecord(CrewWriteResource record) {
            record.UserId = Identity.GetConnectedUserId(httpContext);
            return record;
        }

    }

}