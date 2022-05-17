using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Destinations {

    [Route("api/[controller]")]
    public class DestinationsController : ControllerBase {

        #region variables

        private readonly IDestinationRepository repo;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        #endregion

        public DestinationsController(IDestinationRepository repo, IHttpContextAccessor httpContext, IMapper mapper) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<DestinationListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IActionResult> GetActiveForDropdown() {
            return StatusCode(200, await repo.GetActiveForDropdown());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<DestinationReadResource> GetById(int id) {
            return mapper.Map<Destination, DestinationReadResource>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PostDestination([FromBody] DestinationWriteResource record) {
            repo.Create(mapper.Map<DestinationWriteResource, Destination>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordCreated()
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PutDestination([FromBody] DestinationWriteResource record) {
            repo.Update(mapper.Map<DestinationWriteResource, Destination>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordUpdated()
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteDestination([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private DestinationWriteResource AttachUserIdToRecord(DestinationWriteResource record) {
            var userId = Identity.GetConnectedUserId(httpContext);
            record.UserId = userId;
            return record;
        }

    }

}