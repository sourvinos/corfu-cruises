﻿using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ShipCrews {

    [Route("api/[controller]")]
    public class ShipCrewsController : ControllerBase {

        #region variables

        private readonly IShipCrewRepository repo;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        #endregion

        public ShipCrewsController(IShipCrewRepository repo, IHttpContextAccessor httpContext, IMapper mapper) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ShipCrewListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            return await repo.GetActiveForDropdown();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ShipCrewReadResource> GetCrew(int id) {
            return await repo.GetById(id);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<IActionResult> PostAsync([FromBody] ShipCrewWriteResource record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Create(mapper.Map<ShipCrewWriteResource, ShipCrew>(await AttachUserIdToRecord(AttachOccupantIdToRecord(record))));
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
        public async Task<IActionResult> PutAsync([FromBody] ShipCrewWriteResource record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Update(mapper.Map<ShipCrewWriteResource, ShipCrew>(await AttachUserIdToRecord(AttachOccupantIdToRecord(record))));
                return StatusCode(200, new {
                    response = ApiMessages.RecordUpdated()
                });
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteCrew([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private async Task<ShipCrewWriteResource> AttachUserIdToRecord(ShipCrewWriteResource record) {
            var user = await Identity.GetConnectedUserId(httpContext);
            record.UserId = user.UserId;
            return record;
        }

        private static ShipCrewWriteResource AttachOccupantIdToRecord(ShipCrewWriteResource record) {
            record.OccupantId = 1;
            return record;
        }

        private IActionResult GetErrorMessage(int errorCode) {
            return errorCode switch {
                450 => StatusCode(450, new { Response = ApiMessages.FKNotFoundOrInactive("Gender") }),
                451 => StatusCode(451, new { Response = ApiMessages.FKNotFoundOrInactive("Nationality") }),
                452 => StatusCode(452, new { Response = ApiMessages.FKNotFoundOrInactive("Ship") }),
                _ => StatusCode(490, new { Response = ApiMessages.RecordNotSaved() }),
            };
        }

    }

}