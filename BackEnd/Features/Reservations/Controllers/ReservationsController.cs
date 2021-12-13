using System;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Features.Schedules;
using BlueWaterCruises.Infrastructure.Extensions;
using BlueWaterCruises.Infrastructure.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises.Features.Reservations {

    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase {

        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly ILogger<ReservationsController> logger;
        private readonly IMapper mapper;
        private readonly IReservationRepository reservationRepo;
        private readonly IScheduleRepository scheduleRepo;

        public ReservationsController(IHttpContextAccessor httpContextAccessor, ILogger<ReservationsController> logger, IMapper mapper, IReservationRepository reservationRepo, IScheduleRepository scheduleRepo) {
            this.httpContextAccessor = httpContextAccessor;
            this.logger = logger;
            this.mapper = mapper;
            this.reservationRepo = reservationRepo;
            this.scheduleRepo = scheduleRepo;
        }

        [HttpGet("date/{date}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ReservationGroupResource<ReservationListResource>> Get([FromRoute] string date) {
            return await this.reservationRepo.Get(date);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<IActionResult> GetReservation(string id) {
            var record = await reservationRepo.GetById(id);
            if (record == null) {
                id.LogException(logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            if (await Identity.IsUserAdmin(httpContextAccessor) || await reservationRepo.DoesUserOwnRecord(record.UserId)) {
                return StatusCode(200, new {
                    response = record
                });
            } else {
                return StatusCode(490, new {
                    response = ApiMessages.NotOwnRecord()
                });
            }
        }

        [HttpPost]
        [Authorize(Roles = "user, admin")]
        public IActionResult PostReservation([FromBody] ReservationWriteResource record) {
            if (ModelState.IsValid) {
                try {
                    var response = reservationRepo.IsValid(record, scheduleRepo);
                    if (response == 200) {
                        reservationRepo.Create(mapper.Map<ReservationWriteResource, Reservation>(this.AttachUserIdToNewRecord(record)));
                        return StatusCode(200, new {
                            response = ApiMessages.RecordCreated()
                        });
                    } else {
                        return this.GetErrorMessage(response);
                    }
                } catch (Exception exception) {
                    FileLoggerExtensions.LogException(0, logger, ControllerContext, record, exception);
                    return StatusCode(490, new {
                        response = ApiMessages.RecordNotSaved()
                    });
                }
            }
            FileLoggerExtensions.LogException(0, logger, ControllerContext, record, null);
            return StatusCode(400, new {
                response = ApiMessages.InvalidModel()
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<IActionResult> PutReservation([FromRoute] string id, [FromBody] ReservationWriteResource record) {
            if (id == record.ReservationId.ToString() && ModelState.IsValid) {
                if (await Identity.IsUserAdmin(httpContextAccessor) || await reservationRepo.DoesUserOwnRecord(record.UserId)) {
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
                        FileLoggerExtensions.LogException(0, logger, ControllerContext, record, exception);
                        return StatusCode(490, new {
                            response = ApiMessages.RecordNotSaved()
                        });
                    }
                } else {
                    return StatusCode(401, new {
                        response = ApiMessages.NotOwnRecord()
                    });
                }
            } else {
                FileLoggerExtensions.LogException(0, logger, ControllerContext, record, null);
                return StatusCode(400, new {
                    response = ApiMessages.InvalidModel()
                });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteReservation([FromRoute] string id) {
            if (await Identity.IsUserAdmin(httpContextAccessor)) {
                var record = await reservationRepo.GetByIdToDelete(id);
                if (record == null) {
                    id.LogException(logger, ControllerContext, null, null);
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
                    FileLoggerExtensions.LogException(0, logger, ControllerContext, record, exception);
                    return StatusCode(491, new {
                        response = ApiMessages.RecordInUse()
                    });
                }
            } else {
                id.LogException(logger, ControllerContext, null, null);
                return StatusCode(403, new {
                    response = ApiMessages.InsufficientUserRights()
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
                driverId.LogException(logger, ControllerContext, null, exception);
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
                return StatusCode(200, new {
                    response = ApiMessages.RecordUpdated()
                });
            } catch (DbUpdateException exception) {
                shipId.LogException(logger, ControllerContext, null, exception);
                return StatusCode(490, new {
                    response = ApiMessages.RecordNotSaved()
                });
            }
        }

        private IActionResult GetErrorMessage(int errorCode) {
            return errorCode switch {
                432 => StatusCode(432, new { response = ApiMessages.DayHasNoSchedule() }),
                430 => StatusCode(430, new { response = ApiMessages.DayHasNoScheduleForDestination() }),
                427 => StatusCode(427, new { response = ApiMessages.PortHasNoDepartures() }),
                433 => StatusCode(433, new { response = ApiMessages.PortHasNoVacancy() }),
                409 => StatusCode(409, new { response = ApiMessages.DuplicateRecord() }),
                _ => StatusCode(490, new { Response = ApiMessages.RecordNotSaved() }),
            };
        }

        private ReservationWriteResource AttachUserIdToNewRecord(ReservationWriteResource reservation) {
            reservation.UserId = Identity.GetConnectedUserId(httpContextAccessor);
            return reservation;
        }

    }

}