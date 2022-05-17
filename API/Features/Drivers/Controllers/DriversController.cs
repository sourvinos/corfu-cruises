using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Drivers {

    [Route("api/[controller]")]
    public class DriversController : ControllerBase {

        #region variables

        private readonly IDriverRepository repo;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        #endregion

        public DriversController(IDriverRepository repo, IHttpContextAccessor httpContext, IMapper mapper) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<DriverListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IActionResult> GetActiveForDropdown() {
            return StatusCode(200, await repo.GetActiveForDropdown());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<DriverReadResource> GetDriver(int id) {
            return mapper.Map<Driver, DriverReadResource>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PostDriver([FromBody] DriverWriteResource record) {
            repo.Create(mapper.Map<DriverWriteResource, Driver>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordCreated()
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PutDriver([FromBody] DriverWriteResource record) {
            repo.Update(mapper.Map<DriverWriteResource, Driver>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordUpdated()
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteDriver([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private DriverWriteResource AttachUserIdToRecord(DriverWriteResource record) {
            var userId = Identity.GetConnectedUserId(httpContext);
            record.UserId = userId;
            return record;
        }

    }

}