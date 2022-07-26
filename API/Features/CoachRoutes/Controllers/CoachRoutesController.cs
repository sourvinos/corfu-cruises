using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.CoachRoutes {

    [Route("api/[controller]")]
    public class CoachRoutesController : ControllerBase {

        #region variables

        private readonly ICoachRouteRepository repo;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMapper mapper;

        #endregion

        public CoachRoutesController(ICoachRouteRepository repo, IHttpContextAccessor httpContextAccessor, IMapper mapper) {
            this.httpContextAccessor = httpContextAccessor;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<CoachRouteListDto>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<CoachRouteActiveForDropdownVM>> GetActiveForDropdown() {
            return await repo.GetActiveForDropdown();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<CoachRouteReadDto> GetRoute(int id) {
            return mapper.Map<CoachRoute, CoachRouteReadDto>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PostRouteAsync([FromBody] CoachRouteWriteDto record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Create(mapper.Map<CoachRouteWriteDto, CoachRoute>(await AttachUserIdToRecord(record)));
                return ApiResponses.OK();
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PutRouteAsync([FromBody] CoachRouteWriteDto record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Update(mapper.Map<CoachRouteWriteDto, CoachRoute>(await AttachUserIdToRecord(record)));
                return ApiResponses.OK();
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> DeleteRoute([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return ApiResponses.OK();
        }

        private async Task<CoachRouteWriteDto> AttachUserIdToRecord(CoachRouteWriteDto record) {
            var user = await Identity.GetConnectedUserId(httpContextAccessor);
            record.UserId = user.UserId;
            return record;
        }

        private Response GetErrorMessage(int errorCode) {
            httpContextAccessor.HttpContext.Response.StatusCode = errorCode;
            return errorCode switch {
                450 => new Response { StatusCode = 450, Icon = Icons.Error.ToString(), Message = ApiMessages.FKNotFoundOrInactive("Port") },
                _ => new Response { Message = ApiMessages.RecordNotSaved() },
            };
        }

    }

}