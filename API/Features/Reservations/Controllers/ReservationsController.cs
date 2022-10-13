﻿using System.Collections.Generic;
using System.Threading.Tasks;
using API.Features.Schedules;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Reservations {

    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase {

        #region variables

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;
        private readonly IReservationAvailability reservationAvailability;
        private readonly IReservationCalendar reservationCalendar;
        private readonly IReservationReadRepository reservationReadRepo;
        private readonly IReservationUpdateRepository reservationUpdateRepo;
        private readonly IReservationValidation validReservation;
        private readonly IScheduleRepository scheduleRepo;

        #endregion

        public ReservationsController(IHttpContextAccessor httpContext, IMapper mapper, IReservationAvailability reservationAvailability, IReservationCalendar reservationCalendar, IReservationReadRepository reservationReadRepo, IReservationUpdateRepository reservationUpdateRepo, IReservationValidation validReservation, IScheduleRepository scheduleRepo) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.reservationAvailability = reservationAvailability;
            this.reservationCalendar = reservationCalendar;
            this.reservationReadRepo = reservationReadRepo;
            this.reservationUpdateRepo = reservationUpdateRepo;
            this.scheduleRepo = scheduleRepo;
            this.validReservation = validReservation;
        }

        [HttpGet("fromDate/{fromDate}/toDate/{toDate}")]
        [Authorize(Roles = "user, admin")]
        public IEnumerable<ReservationCalendarGroupVM> GetForCalendar([FromRoute] string fromDate, string toDate) {
            return reservationCalendar.GetForCalendar(fromDate, toDate);
        }

        [HttpGet("date/{date}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ReservationMappedGroupVM<ReservationMappedListVM>> GetForDailyList([FromRoute] string date) {
            return await reservationReadRepo.GetForDailyList(date);
        }

        [HttpGet("date/{date}/driver/{driverId}")]
        [Authorize(Roles = "admin")]
        public async Task<ReservationDriverGroupVM<Reservation>> GetByDateAndDriver([FromRoute] string date, int driverId) {
            return await reservationReadRepo.GetByDateAndDriver(date, driverId);
        }

        [HttpGet("refNo/{refNo}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ReservationMappedGroupVM<ReservationMappedListVM>> GetByRefNo([FromRoute] string refNo) {
            return await reservationReadRepo.GetByRefNo(refNo);
        }

        [HttpGet("{reservationId}")]
        [Authorize(Roles = "user, admin")]
        public async Task<Response> GetById(string reservationId) {
            var x = await reservationReadRepo.GetById(reservationId, true);
            if (x != null) {
                if (Identity.IsUserAdmin(httpContext) || await validReservation.IsUserOwner(x.CustomerId)) {
                    return new Response {
                        Code = 200,
                        Icon = Icons.Info.ToString(),
                        Message = ApiMessages.OK(),
                        Body = mapper.Map<Reservation, ReservationReadDto>(x)
                    };
                } else {
                    throw new CustomException() {
                        ResponseCode = 490
                    };
                }
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        [HttpPost]
        [Authorize(Roles = "user, admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Post([FromBody] ReservationWriteDto reservation) {
            var x = validReservation.IsValid(reservation, scheduleRepo);
            if (x == 200) {
                if (Identity.IsUserAdmin(httpContext) || await validReservation.IsUserOwner(reservation.CustomerId)) {
                    await AttachNewRefNoToDto(reservation);
                    AttachPortIdToDto(reservation);
                    reservationUpdateRepo.Create(mapper.Map<ReservationWriteDto, Reservation>(reservationUpdateRepo.AttachUserIdToDto(reservation)));
                    return new Response {
                        Code = 200,
                        Icon = Icons.Success.ToString(),
                        Message = reservation.RefNo
                    };
                } else {
                    throw new CustomException() {
                        ResponseCode = 490
                    };
                }
            } else {
                throw new CustomException() {
                    ResponseCode = x
                };
            }
        }

        [HttpPut]
        [Authorize(Roles = "user, admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] ReservationWriteDto reservation) {
            var x = await reservationReadRepo.GetById(reservation.ReservationId.ToString(), false);
            if (x != null) {
                if (Identity.IsUserAdmin(httpContext) || await validReservation.IsUserOwner(x.CustomerId)) {
                    var z = validReservation.IsValid(reservation, scheduleRepo);
                    if (z == 200) {
                        AttachPortIdToDto(reservation);
                        reservationUpdateRepo.Update(reservation.ReservationId, mapper.Map<ReservationWriteDto, Reservation>(reservationUpdateRepo.AttachUserIdToDto(reservation)));
                        return new Response {
                            Code = 200,
                            Icon = Icons.Success.ToString(),
                            Message = reservation.RefNo
                        };
                    } else {
                        throw new CustomException() {
                            ResponseCode = z
                        };
                    }
                } else {
                    throw new CustomException() {
                        ResponseCode = 490
                    };
                }
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> Delete([FromRoute] string id) {
            var x = await reservationReadRepo.GetById(id, false);
            if (x != null) {
                reservationUpdateRepo.Delete(x);
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

        [HttpPatch("assignToDriver")]
        [Authorize(Roles = "admin")]
        public Response AssignToDriver(int driverId, [FromQuery(Name = "id")] string[] ids) {
            reservationUpdateRepo.AssignToDriver(driverId, ids);
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

        [HttpPatch("assignToShip")]
        [Authorize(Roles = "admin")]
        public Response AssignToShip(int shipId, [FromQuery(Name = "id")] string[] ids) {
            reservationUpdateRepo.AssignToShip(shipId, ids);
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

        [HttpGet("isOverbooked/date/{date}/destinationId/{destinationId}")]
        [Authorize(Roles = "user, admin")]
        public bool IsOverbooked([FromRoute] string date, int destinationId) {
            return validReservation.IsOverbooked(date, destinationId);
        }

        [HttpGet("date/{date}/destinationId/{destinationId}/portId/{portId}")]
        [Authorize(Roles = "user, admin")]
        public IList<ReservationAvailabilityVM> CalculateAvailability(string date, int destinationId, int portId) {
            return reservationAvailability.CalculateAvailability(date, destinationId, portId);
        }

        private ReservationWriteDto AttachPortIdToDto(ReservationWriteDto reservation) {
            reservation.PortId = validReservation.GetPortIdFromPickupPointId(reservation);
            return reservation;
        }

        private async Task<ReservationWriteDto> AttachNewRefNoToDto(ReservationWriteDto reservation) {
            reservation.RefNo = await reservationUpdateRepo.AssignRefNoToNewDto(reservation);
            return reservation;
        }

    }

}