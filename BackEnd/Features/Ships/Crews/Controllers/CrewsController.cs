using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises.Features.Crews {

    [Authorize]
    [Route("api/[controller]")]

    public class CrewsController : ControllerBase {

        private readonly ICrewRepository repo;
        private readonly ILogger<CrewsController> logger;
        private readonly IMapper mapper;

        public CrewsController(ICrewRepository repo, ILogger<CrewsController> logger, IMapper mapper) {
            this.repo = repo;
            this.logger = logger;
            this.mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<CrewListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<IActionResult> GetΒyId(int id) {
            CrewReadResource record = await repo.GetById(id);
            if (record == null) {
                id.LogException(logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            return StatusCode(200, record);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public IActionResult Post([FromBody] CrewWriteResource record) {
            if (ModelState.IsValid) {
                try {
                    repo.Create(mapper.Map<CrewWriteResource, Crew>(record));
                    return StatusCode(200, new {
                        response = ApiMessages.RecordCreated()
                    });
                } catch (Exception exception) {
                    LoggerExtensions.LogException(0, logger, ControllerContext, record, exception);
                    return StatusCode(490, new {
                        response = ApiMessages.RecordNotSaved()
                    });
                }
            }
            LoggerExtensions.LogException(0, logger, ControllerContext, record, null);
            return StatusCode(400, new {
                response = ApiMessages.InvalidModel()
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult Put([FromRoute] int id, [FromBody] CrewWriteResource record) {
            if (id == record.Id && ModelState.IsValid) {
                try {
                    repo.Update(mapper.Map<CrewWriteResource, Crew>(record));
                    return StatusCode(200, new {
                        response = ApiMessages.RecordUpdated()
                    });
                } catch (DbUpdateException exception) {
                    LoggerExtensions.LogException(0, logger, ControllerContext, record, exception);
                    return StatusCode(490, new {
                        response = ApiMessages.RecordNotSaved()
                    });
                }
            }
            LoggerExtensions.LogException(0, logger, ControllerContext, record, null);
            return StatusCode(400, new {
                response = ApiMessages.InvalidModel()
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete([FromRoute] int id) {
            Crew record = await repo.GetByIdToDelete(id);
            if (record == null) {
                id.LogException(logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            try {
                repo.Delete(record);
                return StatusCode(200, new {
                    response = ApiMessages.RecordDeleted()
                });
            } catch (DbUpdateException exception) {
                LoggerExtensions.LogException(0, logger, ControllerContext, record, exception);
                return StatusCode(491, new {
                    response = ApiMessages.RecordInUse()
                });
            }
        }

    }

}