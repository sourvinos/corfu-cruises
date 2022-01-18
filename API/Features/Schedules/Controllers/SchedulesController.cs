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
        public async Task<IEnumerable<ScheduleListResource>> GetForList() {
            return await repo.GetForList();
        }

        [HttpGet("from/{fromdate}/to/{todate}")]
        [Authorize(Roles = "user, admin")]
        public IEnumerable<ScheduleReservationGroup> GetForCalendar(string fromDate, string toDate, Guid? reservationId) {
            return repo.DoCalendarTasks(fromDate, toDate, reservationId);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ScheduleReadResource> GetById(int id) {
            return await repo.GetById(id);
        }

        [HttpGet("[action]/date/{date}")]
        [Authorize(Roles = "user, admin")]
        public bool IsSchedule(DateTime date) {
            return repo.DayHasSchedule(date);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public IActionResult PostSchedule([FromBody] List<ScheduleWriteResource> records) {
            var response = repo.IsValid(records);
            if (response == 200) {
                AttachUserIdToRecord(records);
                repo.Create(mapper.Map<List<ScheduleWriteResource>, List<Schedule>>(records));
                return StatusCode(200, new {
                    response = ApiMessages.RecordCreated()
                });
            } else {
                return GetErrorMessage(response);
            }
        }

        // [HttpPut("{id}")]
        // [Authorize(Roles = "admin")]
        // public IActionResult PutSchedule([FromBody] ScheduleWriteResource record) {
        //     repo.Update(mapper.Map<ScheduleWriteResource, Schedule>(AttachUserIdToRecord(record)));
        //     return StatusCode(200, new {
        //         response = ApiMessages.RecordUpdated()
        //     });
        // }

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
        public void DeleteRangeSchedule([FromBody] List<Schedule> schedules) {
            repo.DeleteRange(schedules);
        }

        private List<ScheduleWriteResource> AttachUserIdToRecord(List<ScheduleWriteResource> records) {
            foreach (var record in records) {
                record.UserId = Identity.GetConnectedUserId(httpContext);
            }
            return records;
        }

        private IActionResult GetErrorMessage(int errorCode) {
            return errorCode switch {
                450 => StatusCode(450, new { response = ApiMessages.FKNotFoundOrInactive("Port Id") }),
                451 => StatusCode(451, new { response = ApiMessages.FKNotFoundOrInactive("Destination Id") }),
                _ => StatusCode(490, new { Response = ApiMessages.RecordNotSaved() }),
            };
        }

    }

}