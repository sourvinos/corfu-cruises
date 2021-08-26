using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises.Features.PickupPoints {

    // [Authorize]
    [Route("api/[controller]")]

    public class PickupPointsController : ControllerBase {

        private readonly IPickupPointRepository repo;
        private readonly ILogger<PickupPointsController> logger;
        private readonly IMapper mapper;

        public PickupPointsController(IPickupPointRepository repo, ILogger<PickupPointsController> logger, IMapper mapper) {
            this.repo = repo;
            this.logger = logger;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<PickupPointListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<PickupPointDropdownResource>> GetActiveForDropdown() {
            return await repo.GetActiveForDropdown();
        }

        [HttpGet("routeId/{routeId}")]
        public async Task<IEnumerable<PickupPoint>> GetForRoute(int routeId) {
            return await repo.GetForRoute(routeId);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id) {
            PickupPointReadResource record = await repo.GetById(id);
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
        public IActionResult PostPickupPoint([FromBody] PickupPointWriteResource record) {
            if (ModelState.IsValid) {
                try {
                    repo.Create(mapper.Map<PickupPointWriteResource, PickupPoint>(record));
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
        public IActionResult PutPickupPoint([FromRoute] int id, [FromBody] PickupPointWriteResource record) {
            if (id == record.Id && ModelState.IsValid) {
                try {
                    var pickupPoint = mapper.Map<PickupPointWriteResource, PickupPoint>(record);
                    repo.Update(pickupPoint);
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

        [HttpPatch("{pickupPointId}")]
        // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PatchPickupPoint([FromQuery(Name="pickupPointId")] int pickupPointId, [FromQuery(Name = "coordinates")] string coordinates) {
            PickupPointReadResource record = await repo.GetById(pickupPointId);
            if (record == null) {
                LoggerExtensions.LogException(pickupPointId, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            if (pickupPointId == record.Id && ModelState.IsValid) {
                try {
                    repo.UpdateCoordinates(pickupPointId, coordinates);
                    return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
                } catch (DbUpdateException exception) {
                    LoggerExtensions.LogException(pickupPointId, logger, ControllerContext, null, exception);
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
        public async Task<IActionResult> DeletePickupPoint([FromRoute] int id) {
            PickupPoint record = await repo.GetByIdToDelete(id);
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