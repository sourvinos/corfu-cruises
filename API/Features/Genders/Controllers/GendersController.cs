﻿using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Genders {

    [Route("api/[controller]")]
    public class GendersController : ControllerBase {

        #region variables

        private readonly IGenderRepository repo;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        #endregion

        public GendersController(IGenderRepository repo, IHttpContextAccessor httpContext, IMapper mapper) {
            this.httpContext = httpContext;
            this.repo = repo;
            this.mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<GenderListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            return await repo.GetActiveForDropdown();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<GenderReadResource> GetGender(int id) {
            return mapper.Map<Gender, GenderReadResource>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<IActionResult> PostGenderAsync([FromBody] GenderWriteResource record) {
            repo.Create(mapper.Map<GenderWriteResource, Gender>(await AttachUserIdToRecordAsync(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordCreated()
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<IActionResult> PutGenderAsync([FromBody] GenderWriteResource record) {
            repo.Update(mapper.Map<GenderWriteResource, Gender>(await AttachUserIdToRecordAsync(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordUpdated()
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteGender([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private async Task<GenderWriteResource> AttachUserIdToRecordAsync(GenderWriteResource record) {
            var userId = await Identity.GetConnectedUserId(httpContext);
            record.UserId = userId.UserId;
            return record;
        }

    }

}