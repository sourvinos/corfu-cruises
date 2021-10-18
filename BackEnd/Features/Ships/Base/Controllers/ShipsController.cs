using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises.Features.Ships {

    // [Authorize]
    [Route("api/[controller]")]

    public class ShipsController : ControllerBase {

        private readonly IShipRepository repo;
        private readonly ILogger<ShipsController> logger;
        private readonly IMapper mapper;

        public ShipsController(IShipRepository repo, ILogger<ShipsController> logger, IMapper mapper) {
            this.repo = repo;
            this.logger = logger;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<ShipListResource>> Get() {
            var records = await repo.Get();
            return records;
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            return await repo.GetActiveForDropdown();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetShip(int id) {
            ShipReadResource record = await repo.GetById(id);
            if (record == null) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            return StatusCode(200, record);
        }

        [HttpPost]
        // [Authorize(Roles = "admin")]
        public IActionResult PostShip([FromBody] ShipWriteResource record) {
            if (ModelState.IsValid) {
                try {
                    repo.Create(mapper.Map<ShipWriteResource, Ship>(record));
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
        // [Authorize(Roles = "admin")]
        public IActionResult PutShip([FromRoute] int id, [FromBody] ShipWriteResource record) {
            if (id == record.Id && ModelState.IsValid) {
                try {
                    repo.Update(mapper.Map<ShipWriteResource, Ship>(record));
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
        // [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteShip([FromRoute] int id) {
            Ship record = await repo.GetByIdToDelete(id);
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