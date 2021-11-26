using System;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Features.Schedules;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises.Features.Reservations {

    [Route("api/[controller]")]

    public class ReservationsController : ControllerBase {

        private readonly IReservationRepository reservationRepo;
        private readonly IScheduleRepository scheduleRepo;
        private readonly ILogger<ReservationsController> logger;
        private readonly IMapper mapper;

        public ReservationsController(IReservationRepository reservationRepo, IScheduleRepository scheduleRepo, ILogger<ReservationsController> logger, IMapper mapper) {
            this.reservationRepo = reservationRepo;
            this.scheduleRepo = scheduleRepo;
            this.logger = logger;
            this.mapper = mapper;
        }

        [HttpGet("date/{date}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ReservationGroupResource<ReservationListResource>> Get([FromBody] User user, string date) {
            return await this.reservationRepo.Get(user.UserId, date);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<IActionResult> GetById([FromBody] User user, string id) {
            var record = await reservationRepo.GetById(user.UserId, id);
            if (record == null) {
                LoggerExtensions.LogException(id.ToString(), logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            };
            return await reservationRepo.UserIsAdmin(user.UserId)
                ? StatusCode(200, record)
                : StatusCode(490, new {
                    response = ApiMessages.NotOwnRecord()
                });
        }

        [HttpPost]
        [Authorize(Roles = "user, admin")]
        public IActionResult Post([FromBody] ReservationWriteResource record) {
            if (ModelState.IsValid) {
                try {
                    var response = reservationRepo.IsValid(record, scheduleRepo);
                    if (response == 200) {
                        reservationRepo.Create(mapper.Map<ReservationWriteResource, Reservation>(record));
                        return StatusCode(200, new {
                            response = ApiMessages.RecordCreated()
                        });
                    } else {
                        return this.GetErrorMessage(response);
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
        [Authorize(Roles = "user, admin")]
        public IActionResult Put([FromRoute] string id, [FromBody] ReservationWriteResource record) {
            if (id == record.ReservationId.ToString() && ModelState.IsValid) {
                try {
                    var response = reservationRepo.IsValid(record, scheduleRepo);
                    if (response == 200) {
                        reservationRepo.Update(id, mapper.Map<ReservationWriteResource, Reservation>(record));
                        return StatusCode(200, new {
                            response = ApiMessages.RecordUpdated()
                        });
                    } else {
                        return this.GetErrorMessage(response);
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
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete([FromRoute] string id) {
            var record = await reservationRepo.GetByIdToDelete(id);
            if (record == null) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            try {
                reservationRepo.Delete(record);
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
        [Authorize(Roles = "admin")]
        public IActionResult AssignToDriver(int driverId, [FromQuery(Name = "id")] string[] ids) {
            try {
                reservationRepo.AssignToDriver(driverId, ids);
                return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
            } catch (DbUpdateException exception) {
                LoggerExtensions.LogException(driverId, logger, ControllerContext, null, exception);
                return StatusCode(490, new {
                    response = ApiMessages.RecordNotSaved()
                });
            }
        }

        [HttpPatch("assignToShip")]
        [Authorize(Roles = "admin")]
        public IActionResult AssignToShip(int shipId, [FromQuery(Name = "id")] string[] ids) {
            try {
                reservationRepo.AssignToShip(shipId, ids);
                return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
            } catch (DbUpdateException exception) {
                LoggerExtensions.LogException(shipId, logger, ControllerContext, null, exception);
                return StatusCode(490, new {
                    response = ApiMessages.RecordNotSaved()
                });
            }
        }

        private IActionResult GetErrorMessage(int errorCode) {
            switch (errorCode) {
                case 432:
                    return StatusCode(432, new { response = ApiMessages.DayHasNoSchedule() });
                case 430:
                    return StatusCode(430, new { response = ApiMessages.DayHasNoScheduleForDestination() });
                case 427:
                    return StatusCode(427, new { response = ApiMessages.PortHasNoDepartures() });
                case 433:
                    return StatusCode(433, new { response = ApiMessages.PortHasNoVacancy() });
                case 409:
                    return StatusCode(409, new { response = ApiMessages.DuplicateRecord() });
                default:
                    return StatusCode(490, new { Response = ApiMessages.RecordNotSaved() });
            }
        }

    }

}