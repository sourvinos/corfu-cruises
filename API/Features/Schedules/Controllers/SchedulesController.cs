using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Schedules {

    [Route("api/[controller]")]
    public class SchedulesController : ControllerBase {

        #region variables

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;
        private readonly IScheduleRepository repo;

        #endregion

        public SchedulesController(IHttpContextAccessor httpContext, IScheduleRepository repo, IMapper mapper) {
            this.repo = repo;
            this.httpContext = httpContext;
            this.mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ScheduleListViewModel>> Get() {
            return await repo.GetForList();
        }

        [HttpGet("from/{fromdate}/to/{todate}")]
        [Authorize(Roles = "user, admin")]
        public IEnumerable<ScheduleReservationGroup> GetForCalendar(string fromDate, string toDate, Guid? reservationId) {
            return repo.DoCalendarTasks(fromDate, toDate, reservationId);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ScheduleReadDto> GetById(int id) {
            return await repo.GetById(id);
        }

        [HttpGet("[action]/date/{date}")]
        [Authorize(Roles = "user, admin")]
        public bool IsSchedule(string date) {
            return repo.DayHasSchedule(date);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PostSchedule([FromBody] List<ScheduleWriteDto> records) {
            var response = repo.IsValidOnNew(records);
            if (response == 200) {
                AttachUserIdToRecordOnNew(records);
                repo.Create(mapper.Map<List<ScheduleWriteDto>, List<Schedule>>(records));
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
        public IActionResult PutSchedule([FromBody] ScheduleWriteDto record) {
            var response = repo.IsValidOnUpdate(record);
            if (response == 200) {
                repo.Update(mapper.Map<ScheduleWriteDto, Schedule>(AttachUserIdToRecordOnUpdateAsync(record)));
                return StatusCode(200, new {
                    response = ApiMessages.RecordUpdated()
                });
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteSchedule([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        [HttpPost("range")]
        [Authorize(Roles = "admin")]
        public IActionResult DeleteRangeSchedule([FromBody] List<ScheduleDeleteRangeDto> schedules) {
            repo.DeleteRange(schedules);
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private List<ScheduleWriteDto> AttachUserIdToRecordOnNew(List<ScheduleWriteDto> records) {
            foreach (var record in records) {
                var userId = Identity.GetConnectedUserId(httpContext);
                record.UserId = userId;
            }
            return records;
        }

        private ScheduleWriteDto AttachUserIdToRecordOnUpdateAsync(ScheduleWriteDto record) {
            var userId = Identity.GetConnectedUserId(httpContext);
            record.UserId = userId;
            return record;
        }

        private IActionResult GetErrorMessage(int errorCode) {
            return errorCode switch {
                450 => StatusCode(450, new { response = ApiMessages.FKNotFoundOrInactive("Destination Id") }),
                451 => StatusCode(451, new { response = ApiMessages.FKNotFoundOrInactive("Port Id") }),
                _ => StatusCode(490, new { Response = ApiMessages.RecordNotSaved() }),
            };
        }

    }

}