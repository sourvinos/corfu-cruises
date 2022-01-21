using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ShipOwners {

    [Route("api/[controller]")]
    public class ShipOwnersController : ControllerBase {

        #region variables

        private readonly IShipOwnerRepository repo;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        #endregion

        public ShipOwnersController(IShipOwnerRepository repo, IHttpContextAccessor httpContext, IMapper mapper) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ShipOwnerListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            return await repo.GetActiveForDropdown();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ShipOwnerReadResource> GetShipOwner(int id) {
            return mapper.Map<ShipOwner, ShipOwnerReadResource>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PostShipOwner([FromBody] ShipOwnerWriteResource record) {
            repo.Create(mapper.Map<ShipOwnerWriteResource, ShipOwner>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordCreated()
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PutShipOwner([FromBody] ShipOwnerWriteResource record) {
            repo.Update(mapper.Map<ShipOwnerWriteResource, ShipOwner>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordUpdated()
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteShipOwner([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private ShipOwnerWriteResource AttachUserIdToRecord(ShipOwnerWriteResource record) {
            record.UserId = Identity.GetConnectedUserId(httpContext);
            return record;
        }

    }

}