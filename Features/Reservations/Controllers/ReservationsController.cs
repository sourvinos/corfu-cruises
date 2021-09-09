using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises.Features.Reservations {

    // [Authorize]
    [Route("api/[controller]")]

    public class ReservationsController : ControllerBase {

        private readonly IReservationRepository repo;
        private readonly ILogger<ReservationsController> logger;
        private readonly IMapper mapper;

        public ReservationsController(IReservationRepository repo, ILogger<ReservationsController> logger, IMapper mapper) {
            this.repo = repo;
            this.logger = logger;
            this.mapper = mapper;
        }

        [HttpGet("date/{date}")]
        public async Task<ReservationGroupResource<ReservationListResource>> GetForDate(string date) {
            return await this.repo.GetForDate(date);
        }

        [HttpGet("[action]/destinationId/{destinationId}")]
        public IEnumerable<MainResult> GetForDestination(int destinationId) {
            var records = repo.GetForDestination(destinationId);
            return records;
        }

        [HttpGet("[action]/date/{date}/destinationId/{destinationId}/portId/{portId}")]
        public ReservationTotalPersons GetForDateAndDestinationAndPort(string date, int destinationId, int portId) {
            return repo.GetForDateAndDestinationAndPort(date, destinationId, portId);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSingle(string id) {
            var record = await repo.GetSingle(id);
            if (record == null) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            };
            return StatusCode(200, record);
        }

        [HttpPost]
        public IActionResult Post([FromBody] ReservationWriteResource record) {
            if (ModelState.IsValid) {
                try {
                    if (repo.IsKeyUnique(record)) {
                        repo.Create(mapper.Map<ReservationWriteResource, Reservation>(record));
                        return StatusCode(200, new {
                            response = ApiMessages.RecordCreated()
                        });
                    } else {
                        return StatusCode(409, new {
                            response = ApiMessages.DuplicateRecord()
                        });
                    }
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
        public IActionResult Put([FromRoute] string id, [FromBody] ReservationWriteResource record) {
            if (id == record.ReservationId.ToString() && ModelState.IsValid) {
                try {
                    if (repo.Update(id, mapper.Map<ReservationWriteResource, Reservation>(record))) {
                        return StatusCode(200, new {
                            response = ApiMessages.RecordUpdated()
                        });
                    } else {
                        return StatusCode(409, new {
                            response = ApiMessages.DuplicateRecord()
                        });
                    }
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
        public async Task<IActionResult> Delete([FromRoute] string id) {
            var record = await repo.GetSingleToDelete(id);
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

        [HttpPatch("assignToDriver")]
        public IActionResult AssignToDriver(int driverId, [FromQuery(Name = "id")] string[] ids) {
            try {
                repo.AssignToDriver(driverId, ids);
                return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
            } catch (DbUpdateException exception) {
                LoggerExtensions.LogException(driverId, logger, ControllerContext, null, exception);
                return StatusCode(490, new {
                    response = ApiMessages.RecordNotSaved()
                });
            }
        }

        [HttpPatch("assignToShip")]
        public IActionResult AssignToShip(int shipId, [FromQuery(Name = "id")] string[] ids) {
            try {
                repo.AssignToShip(shipId, ids);
                return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
            } catch (DbUpdateException exception) {
                LoggerExtensions.LogException(shipId, logger, ControllerContext, null, exception);
                return StatusCode(490, new {
                    response = ApiMessages.RecordNotSaved()
                });
            }
        }

        [HttpGet("from/{fromdate}/to/{todate}")]
        public IEnumerable<ReservationResource> GetForPeriod(string fromDate, string toDate) {
            return repo.GetForPeriod(fromDate, toDate);
        }

    }

}