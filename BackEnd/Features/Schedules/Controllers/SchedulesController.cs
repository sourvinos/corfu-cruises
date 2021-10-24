using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
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
        private readonly IMapper mapper;

        public SchedulesController(IScheduleRepository repo, ILogger<SchedulesController> logger, IMapper mapper) {
            this.repo = repo;
            this.logger = logger;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<ScheduleListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSchedule(int id) {
            ScheduleReadResource record = await repo.GetById(id);
            if (record == null) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            return StatusCode(200, record);
        }

        [HttpGet("from/{fromdate}/to/{todate}")]
        public IEnumerable<ScheduleReservationGroup> GetForPeriod(string fromDate, string toDate, Guid? reservationId) {
            return repo.DoCalendarTasks(fromDate, toDate, reservationId);
        }

        [HttpGet("[action]/date/{date}")]
        public Boolean IsSchedule(DateTime date) {
            return repo.DayHasSchedule(date);
        }

        [HttpPost]
        // [Authorize(Roles = "admin")] 
        public IActionResult PostSchedule([FromBody] List<ScheduleWriteResource> records) {
            if (ModelState.IsValid) {
                try {
                    repo.Create(mapper.Map<List<ScheduleWriteResource>, List<Schedule>>(records));
                    return StatusCode(200, new {
                        response = ApiMessages.RecordCreated()
                    });
                } catch (Exception exception) {
                    LoggerExtensions.LogArrayException(0, logger, ControllerContext, (records as IEnumerable<object>).Cast<object>().ToList(), exception);
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
        public IActionResult PutSchedule([FromRoute] int id, [FromBody] ScheduleWriteResource record) {
            if (id == record.Id && ModelState.IsValid) {
                try {
                    repo.Update(mapper.Map<ScheduleWriteResource, Schedule>(record));
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
            Schedule record = await repo.GetSingleToDelete(id);
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

    }

}