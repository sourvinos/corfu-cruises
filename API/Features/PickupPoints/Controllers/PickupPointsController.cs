﻿using System.Collections.Generic;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.PickupPoints {

    [Route("api/[controller]")]
    public class PickupPointsController : ControllerBase {

        #region variables

        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMapper mapper;
        private readonly IPickupPointRepository repo;

        #endregion

        public PickupPointsController(IHttpContextAccessor httpContextAccessor, IMapper mapper, IPickupPointRepository repo) {
            this.httpContextAccessor = httpContextAccessor;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<PickupPointListDto>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<PickupPointWithPortDropdownResource>> GetActiveForDropdown() {
            return await repo.GetActiveWithPortForDropdown();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<PickupPointReadDto> GetPickupPoint(int id) {
            return mapper.Map<PickupPoint, PickupPointReadDto>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PostPickupPointAsync([FromBody] PickupPointWriteDto record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Create(mapper.Map<PickupPointWriteDto, PickupPoint>(await AttachUserIdToRecord(record)));
                return ApiResponses.OK();
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PutPickupPointAsync([FromBody] PickupPointWriteDto record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Update(mapper.Map<PickupPointWriteDto, PickupPoint>(await AttachUserIdToRecord(record)));
                return ApiResponses.OK();
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpPatch("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> PatchPickupPointAsync([FromQuery(Name = "id")] int id, [FromQuery(Name = "coordinates")] string coordinates) {
            await repo.GetById(id);
            repo.UpdateCoordinates(id, coordinates);
            return ApiResponses.OK();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> DeletePickupPoint([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return ApiResponses.OK();
        }

        private async Task<PickupPointWriteDto> AttachUserIdToRecord(PickupPointWriteDto record) {
            var user = await Identity.GetConnectedUserId(httpContextAccessor);
            record.UserId = user.UserId;
            return record;
        }

        private Response GetErrorMessage(int errorCode) {
            httpContextAccessor.HttpContext.Response.StatusCode = errorCode;
            return errorCode switch {
                450 => new Response { StatusCode = 450, Icon = Icons.Error.ToString(), Message = ApiMessages.FKNotFoundOrInactive("Route") },
                _ => new Response { Message = ApiMessages.RecordNotSaved() },
            };
        }

    }

}