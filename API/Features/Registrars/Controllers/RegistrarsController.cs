using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Registrars {

    [Route("api/[controller]")]
    public class RegistrarsController : ControllerBase {

        #region variables

        private readonly IRegistrarRepository repo;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        #endregion

        public RegistrarsController(IRegistrarRepository repo, IHttpContextAccessor httpContext, IMapper mapper) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<RegistrarListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetActiveForDropdown() {
            return StatusCode(200, await repo.GetActiveForDropdown());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<RegistrarReadResource> GetRegistrar(int id) {
            return await repo.GetById(id);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<IActionResult> PostAsync([FromBody] RegistrarWriteResource record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Create(mapper.Map<RegistrarWriteResource, Registrar>(await AttachUserIdToRecordAsync(record)));
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
        public async Task<IActionResult> PutAsync([FromBody] RegistrarWriteResource record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Update(mapper.Map<RegistrarWriteResource, Registrar>(await AttachUserIdToRecordAsync(record)));
                return StatusCode(200, new {
                    response = ApiMessages.RecordUpdated()
                });
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private async Task<RegistrarWriteResource> AttachUserIdToRecordAsync(RegistrarWriteResource record) {
            var userId = await Identity.GetConnectedUserId(httpContext);
            record.UserId = userId.UserId;
            return record;
        }

        private IActionResult GetErrorMessage(int errorCode) {
            return errorCode switch {
                _ => StatusCode(450, new { Response = ApiMessages.FKNotFoundOrInactive("Ship") }),
            };
        }


    }

}