using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises.Features.Ships {

    // [Authorize]
    [Route("api/[controller]")]

    public class ShipRoutesController : ControllerBase {

        private readonly IShipRouteRepository repo;
        private readonly ILogger<ShipRoutesController> logger;

        public ShipRoutesController(IShipRouteRepository repo, ILogger<ShipRoutesController> logger) {
            this.repo = repo;
            this.logger = logger;
        }

        [HttpGet]
        public async Task<IEnumerable<ShipRouteListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<ShipRoute>> GetActive() {
            return await repo.GetActive(x => x.IsActive);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetShipRoute(int id) {
            ShipRoute record = await repo.GetById(id);
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
        public IActionResult PostShipRoute([FromBody] ShipRoute record) {
            if (ModelState.IsValid) {
                try {
                    repo.Create(record);
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
        public IActionResult PutShipRoute([FromRoute] int id, [FromBody] ShipRoute record) {
            if (id == record.Id && ModelState.IsValid) {
                try {
                    repo.Update(record);
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
        public async Task<IActionResult> DeleteShipRoute([FromRoute] int id) {
            ShipRoute record = await repo.GetById(id);
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