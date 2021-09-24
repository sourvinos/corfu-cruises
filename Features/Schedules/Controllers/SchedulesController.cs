using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises.Features.Schedules {

    // [Authorize]
    [Route("api/[controller]")]

    public class SchedulesController : ControllerBase {

        private readonly IScheduleRepository repo;
        private readonly ILogger<SchedulesController> logger;

        public SchedulesController(IScheduleRepository repo, ILogger<SchedulesController> logger) {
            this.repo = repo;
            this.logger = logger;
        }

        [HttpGet]
        public async Task<IEnumerable<Schedule>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<Schedule>> GetActive() {
            return await repo.GetActive(x => x.IsActive);
        }

        [HttpGet("[action]/date/{date}")]
        public Boolean IsSchedule(DateTime date) {
            return repo.DayHasSchedule(date);
        }

        [HttpGet("[action]/destinationId/{destinationId}")]
        public async Task<IEnumerable<ScheduleReadResource>> GetForDestination(int destinationId) {
            return await repo.GetForDestination(destinationId);
        }

        [HttpGet("[action]/date/{date}/destinationId/{destinationId}")]
        public ScheduleReadResource GetForDateAndDestination(DateTime date, int destinationId) {
            return repo.GetForDateAndDestination(date, destinationId);
        }

        [HttpGet("[action]/date/{date}/destinationId/{destinationId}/portId/{portId}")]
        public ScheduleReadResource GetForDateAndDestinationAndPort(DateTime date, int destinationId, int portId) {
            return repo.GetForDateAndDestinationAndPort(date, destinationId, portId);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSchedule(int id) {
            Schedule record = await repo.GetById(id);
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
        public IActionResult PostSchedule([FromBody] List<Schedule> records) {
            if (ModelState.IsValid) {
                try {
                    repo.Create(records);
                    return StatusCode(200, new {
                        response = ApiMessages.RecordCreated()
                    });
                } catch (Exception exception) {
                    LoggerExtensions.LogException(0, logger, ControllerContext, records, exception);
                    return StatusCode(490, new {
                        response = ApiMessages.RecordNotSaved()
                    });
                }
            }
            LoggerExtensions.LogException(0, logger, ControllerContext, records, null);
            return StatusCode(400, new {
                response = ApiMessages.InvalidModel()
            });
        }

        [HttpPut("{id}")]
        // [Authorize(Roles = "admin")]
        public IActionResult PutSchedule([FromRoute] int id, [FromBody] Schedule record) {
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
        // [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteSchedule([FromRoute] int id) {
            Schedule record = await repo.GetById(id);
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

        [HttpPost("range")]
        public void DeleteRangeSchedule([FromBody] List<Schedule> schedules) {
            repo.RemoveRange(schedules);
        }

        [HttpGet("from/{fromdate}/to/{todate}")]
        public IEnumerable<ScheduleReservationGroup> GetForPeriod(string fromDate, string toDate) {
            return repo.DoTasks(fromDate, toDate);
        }

    }

}