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

namespace API.Features.Ships {

    [Route("api/[controller]")]
    public class ShipsController : ControllerBase {

        #region variables

        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMapper mapper;
        private readonly IShipRepository repo;

        #endregion

        public ShipsController(IShipRepository repo, IHttpContextAccessor httpContextAccessor, IMapper mapper) {
            this.httpContextAccessor = httpContextAccessor;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ShipListDto>> Get() {
            return mapper.Map<IEnumerable<Ship>, IEnumerable<ShipListDto>>(await repo.Get());
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            return mapper.Map<IEnumerable<Ship>, IEnumerable<SimpleResource>>(await repo.GetActiveForDropdown());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ShipReadDto> GetShip(int id) {
            return mapper.Map<Ship, ShipReadDto>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PostShipAsync([FromBody] ShipWriteDto record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Create(mapper.Map<ShipWriteDto, Ship>(await AttachUserIdToRecord(record)));
                return ApiResponses.OK();
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PutShipAsync([FromBody] ShipWriteDto record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Update(mapper.Map<ShipWriteDto, Ship>(await AttachUserIdToRecord(record)));
                return ApiResponses.OK();
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> DeleteShip([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return ApiResponses.OK();
        }

        private async Task<ShipWriteDto> AttachUserIdToRecord(ShipWriteDto record) {
            var user = await Identity.GetConnectedUserId(httpContextAccessor);
            record.UserId = user.UserId;
            return record;
        }

        private Response GetErrorMessage(int errorCode) {
            httpContextAccessor.HttpContext.Response.StatusCode = errorCode;
            return errorCode switch {
                450 => new Response { StatusCode = 450, Icon = Icons.Error.ToString(), Message = ApiMessages.FKNotFoundOrInactive("Ship owner") },
                _ => new Response { Message = ApiMessages.RecordNotSaved() },
            };
        }

    }

}