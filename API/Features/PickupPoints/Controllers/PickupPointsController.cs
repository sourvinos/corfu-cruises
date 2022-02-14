﻿using System.Collections.Generic;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.PickupPoints {

    [Route("api/[controller]")]
    public class PickupPointsController : ControllerBase {

        #region variables

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;
        private readonly IPickupPointRepository repo;

        #endregion

        public PickupPointsController(IPickupPointRepository repo, IHttpContextAccessor httpContext, IMapper mapper) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<PickupPointListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<PickupPointWithPortDropdownResource>> GetActiveForDropdown() {
            return await repo.GetActiveWithPortForDropdown();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<PickupPointReadResource> GetPickupPoint(int id) {
            return mapper.Map<PickupPoint, PickupPointReadResource>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<IActionResult> PostPickupPointAsync([FromBody] PickupPointWriteResource record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Create(mapper.Map<PickupPointWriteResource, PickupPoint>(await AttachUserIdToRecordAsync(record)));
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
        public async Task<IActionResult> PutPickupPointAsync([FromBody] PickupPointWriteResource record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Update(mapper.Map<PickupPointWriteResource, PickupPoint>(await AttachUserIdToRecordAsync(record)));
                return StatusCode(200, new {
                    response = ApiMessages.RecordUpdated()
                });
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpPatch("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> PatchPickupPoint([FromQuery(Name = "id")] int id, [FromQuery(Name = "coordinates")] string coordinates) {
            await repo.GetById(id);
            repo.UpdateCoordinates(id, coordinates);
            return StatusCode(200, new {
                response = ApiMessages.RecordUpdated()
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeletePickupPoint([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private async Task<PickupPointWriteResource> AttachUserIdToRecordAsync(PickupPointWriteResource record) {
            var userId = await Identity.GetConnectedUserId(httpContext);
            record.UserId = userId.UserId;
            return record;
        }

        private IActionResult GetErrorMessage(int errorCode) {
            return errorCode switch {
                450 => StatusCode(450, new { response = ApiMessages.FKNotFoundOrInactive("Route Id") }),
                _ => StatusCode(490, new { Response = ApiMessages.RecordNotSaved() }),
            };
        }

    }

}