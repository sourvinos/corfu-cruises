using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CorfuCruises {

    [Authorize]
    [Route("api/[controller]")]

    public class DataEntryPersonsController : ControllerBase {

        private readonly IDataEntryPersonRepository repo;
        private readonly ILogger<DataEntryPersonsController> logger;
        private readonly IMapper mapper;

        public DataEntryPersonsController(IDataEntryPersonRepository repo, ILogger<DataEntryPersonsController> logger, IMapper mapper) {
            this.repo = repo;
            this.logger = logger;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<DataEntryPersonReadResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<DataEntryPerson>> GetActive() {
            return await repo.GetActive(x => x.IsActive);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetΒyId(int id) {
            DataEntryPerson record = await repo.GetById(id);
            if (record == null) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            return StatusCode(200, record);
        }

        [HttpPost]
        // [Authorize(Roles = "Admin")]
        public IActionResult Post([FromBody] DataEntryPersonWriteResource record) {
            if (ModelState.IsValid) {
                try {
                    repo.Create(mapper.Map<DataEntryPersonWriteResource, DataEntryPerson>(record));
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
        // [Authorize(Roles = "Admin")]
        public IActionResult Put([FromRoute] int id, [FromBody] DataEntryPersonWriteResource record) {
            if (id == record.Id && ModelState.IsValid) {
                try {
                    repo.Update(mapper.Map<DataEntryPersonWriteResource, DataEntryPerson>(record));
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
        // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete([FromRoute] int id) {
            DataEntryPerson record = await repo.GetById(id);
            if (record == null) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
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