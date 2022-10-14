using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Schedules {

    [Route("api/[controller]")]
    public class SchedulesController : ControllerBase {

        #region variables

        private readonly IMapper mapper;
        private readonly IScheduleCalendar scheduleCalendar;
        private readonly IScheduleRepository scheduleRepo;
        private readonly IScheduleValidation scheduleValidation;

        #endregion

        public SchedulesController(IMapper mapper, IScheduleCalendar scheduleCalendar, IScheduleRepository scheduleRepo, IScheduleValidation scheduleValidation) {
            this.mapper = mapper;
            this.scheduleCalendar = scheduleCalendar;
            this.scheduleRepo = scheduleRepo;
            this.scheduleValidation = scheduleValidation;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ScheduleListVM>> Get() {
            return await scheduleRepo.Get();
        }

        [HttpGet("fromDate/{fromDate}/toDate/{toDate}")]
        [Authorize(Roles = "user, admin")]
        public IEnumerable<AvailabilityCalendarGroupVM> GetForCalendar([FromRoute] string fromDate, string toDate) {
            return scheduleCalendar.CalculateAccumulatedPaxPerPort(scheduleCalendar.GetPaxPerPort(scheduleCalendar.CalculateAccumulatedMaxPaxPerPort(scheduleCalendar.GetForCalendar(fromDate, toDate))));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> GetById(int id) {
            var x = await scheduleRepo.GetById(id, true);
            if (x != null) {
                return new Response {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<Schedule, ScheduleReadDto>(x)
                };
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public Response Post([FromBody] List<ScheduleWriteDto> records) {
            var x = scheduleValidation.IsValidOnNew(records);
            if (x == 200) {
                scheduleRepo.CreateList(mapper.Map<List<ScheduleWriteDto>, List<Schedule>>(scheduleRepo.AttachUserIdToNewDto(records)));
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            } else {
                throw new CustomException() {
                    ResponseCode = x
                };
            }
        }

        [HttpPut]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] ScheduleWriteDto schedule) {
            var x = await scheduleRepo.GetById(schedule.Id, false);
            if (x != null) {
                var z = scheduleValidation.IsValidOnUpdate(schedule);
                if (z == 200) {
                    scheduleRepo.Update(mapper.Map<ScheduleWriteDto, Schedule>(scheduleRepo.AttachUserIdToUpdateDto(schedule)));
                    return new Response {
                        Code = 200,
                        Icon = Icons.Success.ToString(),
                        Message = ApiMessages.OK()
                    };
                } else {
                    throw new CustomException() {
                        ResponseCode = z
                    };
                }
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        [HttpDelete]
        [Authorize(Roles = "admin")]
        public async Task<Response> Delete([FromQuery(Name = "id")] IEnumerable<int> ids) {
            var x = await scheduleRepo.GetRangeByIds(ids);
            if (x != null) {
                scheduleRepo.DeleteRange(x);
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

    }

}