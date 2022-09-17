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
        private readonly IReservationRepository reservationRepo;
        private readonly IScheduleRepository scheduleRepo;

        #endregion

        public ReservationsController(IHttpContextAccessor httpContextAccessor, IMapper mapper, IReservationRepository reservationRepo, IScheduleRepository scheduleRepo) {
            this.httpContext = httpContextAccessor;
            this.mapper = mapper;
            this.reservationRepo = reservationRepo;
            this.scheduleRepo = scheduleRepo;
        }

        [HttpGet("byDate/{date}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ReservationGroupVM<ReservationListVM>> GetByDateAsync([FromRoute] string date) {
            return await reservationRepo.GetByDate(date);
        }

        [HttpGet("byDate/{date}/byDriver/{driverId}")]
        [Authorize(Roles = "admin")]
        public async Task<ReservationDriverGroupVM<Reservation>> GetByDateAndDriverAsync([FromRoute] string date, int driverId) {
            return await reservationRepo.GetByDateAndDriver(date, driverId);
        }

        [HttpGet("byRefNo/{refNo}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ReservationGroupVM<ReservationListVM>> GetByRefNoAsync([FromRoute] string refNo) {
            return await reservationRepo.GetByRefNo(refNo);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<Response> GetById(string id) {
            var record = await reservationRepo.GetById(id);
            if (record == null) {
                return new Response {
                    Code = 404,
                    Icon = Icons.Error.ToString(),
                    Message = ApiMessages.RecordNotFound()
                };
            } else {
                if (await Identity.IsUserAdmin(httpContext) || await reservationRepo.IsUserOwner(record.Customer.Id)) {
                    return new Response {
                        Code = 200,
                        Icon = Icons.Info.ToString(),
                        Message = ApiMessages.OK(),
                        Body = mapper.Map<Reservation, ReservationReadDto>(record)
                    };
                } else {
                    return new Response {
                        Code = 490,
                        Icon = Icons.Error.ToString(),
                        Message = ApiMessages.NotOwnRecord(),
                    };
                }
            }
        }

        [HttpPost]
        [Authorize(Roles = "user, admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PostReservationAsync([FromBody] ReservationWriteDto record) {
            var responseCode = reservationRepo.IsValid(record, scheduleRepo);
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
        public async Task<Response> PutReservation([FromRoute] string id, [FromBody] ReservationWriteDto record) {
            var reservation = await reservationRepo.GetByIdAsNoTracking(id);
            if (await Identity.IsUserAdmin(httpContext) || await reservationRepo.IsUserOwner(reservation.CustomerId)) {
                var responseCode = reservationRepo.IsValid(record, scheduleRepo);
                if (responseCode == 200) {
                    AttachPortIdToRecord(record);
                    UpdateForeignKeysWithNull(record);
                    await AttachUserIdToRecord(record);
                    await reservationRepo.Update(id, mapper.Map<ReservationWriteDto, Reservation>(record));
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
            } else {
                throw new CustomException() {
                    ResponseCode = 490
                };
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> DeleteReservation([FromRoute] string id) {
            var record = await reservationRepo.GetByIdToDelete(id);
            if (record == null) {
                throw new CustomException() {
                    ResponseCode = 404
                };
            } else {
                reservationRepo.Delete(record);
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
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
            return reservationRepo.IsOverbooked(date, destinationId);
        }

        private async Task<ReservationWriteDto> AttachUserIdToRecord(ReservationWriteDto record) {
            var user = await Identity.GetConnectedUserId(httpContext);
            record.UserId = user.UserId;
            return record;
        }

        private ReservationWriteDto AttachPortIdToRecord(ReservationWriteDto record) {
            record.PortId = reservationRepo.GetPortIdFromPickupPointId(record);
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