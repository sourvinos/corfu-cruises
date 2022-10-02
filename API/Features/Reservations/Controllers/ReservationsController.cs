using System;
using System.Collections.Generic;
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

        private readonly IReservationAvailability availabilityCalculator;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;
        private readonly IReservationRepository reservationRepo;
        private readonly IReservationValidation validReservation;
        private readonly IScheduleRepository scheduleRepo;

        #endregion

        public ReservationsController(IReservationAvailability availabilityCalculator, IHttpContextAccessor httpContextAccessor, IMapper mapper, IReservationRepository reservationRepo, IScheduleRepository scheduleRepo, IReservationValidation validReservation) {
            this.availabilityCalculator = availabilityCalculator;
            this.httpContext = httpContextAccessor;
            this.mapper = mapper;
            this.reservationRepo = reservationRepo;
            this.scheduleRepo = scheduleRepo;
            this.validReservation = validReservation;
        }

        [HttpGet("byDate/{date}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ReservationMappedGroupVM<ReservationMappedListVM>> GetByDate([FromRoute] string date) {
            return await reservationRepo.GetByDate(date);
        }

        [HttpGet("byDate/{date}/byDriver/{driverId}")]
        [Authorize(Roles = "admin")]
        public async Task<ReservationDriverGroupVM<Reservation>> GetByDateAndDriver([FromRoute] string date, int driverId) {
            return await reservationRepo.GetByDateAndDriver(date, driverId);
        }

        [HttpGet("byRefNo/{refNo}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ReservationMappedGroupVM<ReservationMappedListVM>> GetByRefNo([FromRoute] string refNo) {
            return await reservationRepo.GetByRefNo(refNo);
        }

        [HttpGet("{reservationId}")]
        [Authorize(Roles = "user, admin")]
        public async Task<Response> GetById(string reservationId) {
            var reservation = await reservationRepo.GetById(reservationId);
            if (reservation != null) {
                if (await Identity.IsUserAdmin(httpContext) || await validReservation.IsUserOwner(reservation.CustomerId)) {
                    return new Response {
                        Code = 200,
                        Icon = Icons.Info.ToString(),
                        Message = ApiMessages.OK(),
                        Body = mapper.Map<Reservation, ReservationReadDto>(reservation)
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
        public async Task<Response> PostReservation([FromBody] ReservationWriteDto record) {
            var responseCode = validReservation.IsValid(record, scheduleRepo);
            if (responseCode == 200) {
                await AssignRefNoToNewReservation(record);
                AttachPortIdToRecord(record);
                await AttachUserIdToRecord(record);
                reservationRepo.Create(mapper.Map<ReservationWriteDto, Reservation>(record));
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = record.RefNo
                };
            } else {
                throw new CustomException() {
                    ResponseCode = responseCode
                };
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "user, admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PutReservation([FromRoute] string id, [FromBody] ReservationWriteDto reservation) {
            var x = await reservationRepo.IsFound(reservation.ReservationId, false);
            if (x != null) {
                if (await Identity.IsUserAdmin(httpContext) || await validReservation.IsUserOwner(x.CustomerId)) {
                    var responseCode = validReservation.IsValid(reservation, scheduleRepo);
                    if (responseCode == 200) {
                        AttachPortIdToRecord(reservation);
                        UpdateForeignKeysWithNull(reservation);
                        await AttachUserIdToRecord(reservation);
                        await reservationRepo.Update(id, mapper.Map<ReservationWriteDto, Reservation>(reservation));
                        return new Response {
                            Code = 200,
                            Icon = Icons.Success.ToString(),
                            Message = reservation.RefNo
                        };
                    } else {
                        throw new CustomException() {
                            ResponseCode = responseCode
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
        public async Task<Response> DeleteReservation([FromRoute] Guid id) {
            var x = await reservationRepo.IsFound(id, true);
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
            return availabilityCalculator.CalculateAvailability(date, destinationId, portId);
        }

        private async Task<ReservationWriteDto> AttachUserIdToRecord(ReservationWriteDto record) {
            var user = await Identity.GetConnectedUserId(httpContext);
            record.UserId = user.UserId;
            return record;
        }

        private ReservationWriteDto AttachPortIdToRecord(ReservationWriteDto record) {
            record.PortId = validReservation.GetPortIdFromPickupPointId(record);
            return record;
        }

        private async Task<ReservationWriteDto> AssignRefNoToNewReservation(ReservationWriteDto record) {
            record.RefNo = await reservationRepo.AssignRefNoToNewReservation(record);
            return record;
        }

        private static ReservationWriteDto UpdateForeignKeysWithNull(ReservationWriteDto reservation) {
            if (reservation.DriverId == 0) reservation.DriverId = null;
            if (reservation.ShipId == 0) reservation.ShipId = null;
            return reservation;
        }

    }

}