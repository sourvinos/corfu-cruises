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
        private readonly IReservationRepository reservationRepo;
        private readonly IReservationValidation validReservation;
        private readonly IScheduleRepository scheduleRepo;

        #endregion

        public ReservationsController(IHttpContextAccessor httpContext, IMapper mapper, IReservationAvailability reservationAvailability, IReservationCalendar reservationCalendar, IReservationRepository reservationRepo, IReservationValidation validReservation, IScheduleRepository scheduleRepo) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.reservationAvailability = reservationAvailability;
            this.reservationCalendar = reservationCalendar;
            this.reservationRepo = reservationRepo;
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
            return await reservationRepo.GetForDailyList(date);
        }

        [HttpGet("date/{date}/driver/{driverId}")]
        [Authorize(Roles = "admin")]
        public async Task<ReservationDriverGroupVM<Reservation>> GetByDateAndDriver([FromRoute] string date, int driverId) {
            return await reservationRepo.GetByDateAndDriver(date, driverId);
        }

        [HttpGet("refNo/{refNo}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ReservationMappedGroupVM<ReservationMappedListVM>> GetByRefNo([FromRoute] string refNo) {
            return await reservationRepo.GetByRefNo(refNo);
        }

        [HttpGet("{reservationId}")]
        [Authorize(Roles = "user, admin")]
        public async Task<Response> GetById(string reservationId) {
            var x = await reservationRepo.GetById(reservationId, true);
            if (x != null) {
                if (await Identity.IsUserAdmin(httpContext) || await validReservation.IsUserOwner(x.CustomerId)) {
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
                await AttachNewRefNoToDto(reservation);
                AttachPortIdToDto(reservation);
                reservationRepo.Create(mapper.Map<ReservationWriteDto, Reservation>(reservationRepo.AttachUserIdToDto(reservation)));
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = reservation.RefNo
                };
            } else {
                throw new CustomException() {
                    ResponseCode = x
                };
            }
        }

        [HttpPut]
        [Authorize(Roles = "user, admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromRoute] string id, [FromBody] ReservationWriteDto reservation) {
            var x = await reservationRepo.GetById(reservation.ReservationId.ToString(), false);
            if (x != null) {
                if (await Identity.IsUserAdmin(httpContext) || await validReservation.IsUserOwner(x.CustomerId)) {
                    var z = validReservation.IsValid(reservation, scheduleRepo);
                    if (z == 200) {
                        AttachPortIdToDto(reservation);
                        await reservationRepo.Update(id, mapper.Map<ReservationWriteDto, Reservation>(reservationRepo.AttachUserIdToDto(reservation)));
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
            var x = await reservationRepo.GetById(id, false);
            if (x != null) {
                reservationRepo.Delete(x);
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
            reservationRepo.AssignToDriver(driverId, ids);
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

        [HttpPatch("assignToShip")]
        [Authorize(Roles = "admin")]
        public Response AssignToShip(int shipId, [FromQuery(Name = "id")] string[] ids) {
            reservationRepo.AssignToShip(shipId, ids);
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
            reservation.RefNo = await reservationRepo.AssignRefNoToNewDto(reservation);
            return reservation;
        }

    }

}