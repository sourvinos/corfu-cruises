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

namespace API.Features.ShipCrews {

    [Route("api/[controller]")]
    public class ShipCrewsController : ControllerBase {

        #region variables

        private readonly IShipCrewRepository repo;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMapper mapper;

        #endregion

        public ShipCrewsController(IShipCrewRepository repo, IHttpContextAccessor httpContextAccessor, IMapper mapper) {
            this.httpContextAccessor = httpContextAccessor;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ShipCrewListDto>> Get() {
            return mapper.Map<IEnumerable<ShipCrew>, IEnumerable<ShipCrewListDto>>(await repo.Get());
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            return mapper.Map<IEnumerable<ShipCrew>, IEnumerable<SimpleResource>>(await repo.GetActiveForDropdown());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ShipCrewReadDto> GetCrew(int id) {
            return mapper.Map<ShipCrew, ShipCrewReadDto>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PostAsync([FromBody] ShipCrewWriteDto record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Create(mapper.Map<ShipCrewWriteDto, ShipCrew>(await AttachUserIdToRecord(AttachOccupantIdToRecord(record))));
                return ApiResponses.OK();
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PutAsync([FromBody] ShipCrewWriteDto record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Update(mapper.Map<ShipCrewWriteDto, ShipCrew>(await AttachUserIdToRecord(AttachOccupantIdToRecord(record))));
                return ApiResponses.OK();
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> DeleteCrew([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return ApiResponses.OK();
        }

        private async Task<ShipCrewWriteDto> AttachUserIdToRecord(ShipCrewWriteDto record) {
            var user = await Identity.GetConnectedUserId(httpContextAccessor);
            record.UserId = user.UserId;
            return record;
        }

        private static ShipCrewWriteDto AttachOccupantIdToRecord(ShipCrewWriteDto record) {
            record.OccupantId = 1;
            return record;
        }

        private Response GetErrorMessage(int errorCode) {
            httpContextAccessor.HttpContext.Response.StatusCode = errorCode;
            return errorCode switch {
                450 => new Response { StatusCode = 450, Icon = Icons.Error.ToString(), Message = ApiMessages.FKNotFoundOrInactive("Gender") },
                451 => new Response { StatusCode = 451, Icon = Icons.Error.ToString(), Message = ApiMessages.FKNotFoundOrInactive("Nationality") },
                452 => new Response { StatusCode = 452, Icon = Icons.Error.ToString(), Message = ApiMessages.FKNotFoundOrInactive("Ship") },
                _ => new Response { Message = ApiMessages.RecordNotSaved() }
            };
        }

    }

}