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

namespace API.Features.Genders {

    [Route("api/[controller]")]
    public class GendersController : ControllerBase {

        #region variables

        private readonly IGenderRepository repo;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMapper mapper;

        #endregion

        public GendersController(IGenderRepository repo, IHttpContextAccessor httpContextAccessor, IMapper mapper) {
            this.httpContextAccessor = httpContextAccessor;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<GenderListDto>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            return await repo.GetActiveForDropdown();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<GenderReadDto> GetGender(int id) {
            return mapper.Map<Gender, GenderReadDto>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PostGenderAsync([FromBody] GenderWriteDto record) {
            repo.Create(mapper.Map<GenderWriteDto, Gender>(await AttachUserIdToRecord(record)));
            return ApiResponses.OK();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PutGenderAsync([FromBody] GenderWriteDto record) {
            repo.Update(mapper.Map<GenderWriteDto, Gender>(await AttachUserIdToRecord(record)));
            return ApiResponses.OK();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> DeleteGender([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return ApiResponses.OK();
        }

        private async Task<GenderWriteDto> AttachUserIdToRecord(GenderWriteDto record) {
            var user = await Identity.GetConnectedUserId(httpContextAccessor);
            record.UserId = user.UserId;
            return record;
        }

    }

}