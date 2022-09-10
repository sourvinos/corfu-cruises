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

namespace API.Features.Registrars {

    [Route("api/[controller]")]
    public class RegistrarsController : ControllerBase {

        #region variables

        private readonly IRegistrarRepository repo;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMapper mapper;

        #endregion

        public RegistrarsController(IRegistrarRepository repo, IHttpContextAccessor httpContextAccessor, IMapper mapper) {
            this.httpContextAccessor = httpContextAccessor;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<RegistrarListDto>> Get() {
            return mapper.Map<IEnumerable<Registrar>, IEnumerable<RegistrarListDto>>(await repo.Get());
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            return mapper.Map<IEnumerable<Registrar>, IEnumerable<SimpleResource>>(await repo.GetActiveForDropdown());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<RegistrarReadDto> GetRegistrar(int id) {
            return mapper.Map<Registrar, RegistrarReadDto>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PostRegistrarAsync([FromBody] RegistrarWriteDto record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Create(mapper.Map<RegistrarWriteDto, Registrar>(await AttachUserIdToRecord(record)));
                return ApiResponses.OK();
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PutRegistrarAsync([FromBody] RegistrarWriteDto record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Update(mapper.Map<RegistrarWriteDto, Registrar>(await AttachUserIdToRecord(record)));
                return ApiResponses.OK();
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> Delete([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return ApiResponses.OK();
        }

        private async Task<RegistrarWriteDto> AttachUserIdToRecord(RegistrarWriteDto record) {
            var user = await Identity.GetConnectedUserId(httpContextAccessor);
            record.UserId = user.UserId;
            return record;
        }

        private Response GetErrorMessage(int errorCode) {
            httpContextAccessor.HttpContext.Response.StatusCode = errorCode;
            return errorCode switch {
                450 => new Response { Code = 450, Icon = Icons.Error.ToString(), Message = ApiMessages.FKNotFoundOrInactive("Ship") },
                _ => new Response { Message = ApiMessages.RecordNotSaved() },
            };
        }

    }

}