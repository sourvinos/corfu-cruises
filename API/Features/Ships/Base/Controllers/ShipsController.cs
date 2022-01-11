using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Ships.Base {

    [Route("api/[controller]")]
    public class ShipsController : ControllerBase {

        private readonly IShipRepository repo;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        public ShipsController(IShipRepository repo, IHttpContextAccessor httpContext, IMapper mapper) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ShipListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            return await repo.GetActiveForDropdown();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ShipReadResource> GetShip(int id) {
            return await repo.GetById(id);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PostShip([FromBody] ShipWriteResource record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Create(mapper.Map<ShipWriteResource, Ship>(AttachUserIdToRecord(record)));
                return StatusCode(200, new {
                    response = ApiMessages.RecordCreated()
                });
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PutShip([FromBody] ShipWriteResource record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Update(mapper.Map<ShipWriteResource, Ship>(AttachUserIdToRecord(record)));
                return StatusCode(200, new {
                    response = ApiMessages.RecordUpdated()
                });
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteShip([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private ShipWriteResource AttachUserIdToRecord(ShipWriteResource record) {
            record.UserId = Identity.GetConnectedUserId(httpContext);
            return record;
        }

        private IActionResult GetErrorMessage(int errorCode) {
            return errorCode switch {
                _ => StatusCode(450, new { Response = ApiMessages.FKNotFoundOrInactive("Ship owner") }),
            };
        }

    }

}