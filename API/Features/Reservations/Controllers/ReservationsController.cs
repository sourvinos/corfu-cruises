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
        public async Task<ReservationGroupResource<ReservationListResource>> GetByDate([FromRoute] string date) {
            return await reservationRepo.GetByDate(date);
        }

        [HttpGet("isOverbooked/date/{date}/destinationId/{destinationId}")]
        [Authorize(Roles = "user, admin")]
        public bool IsOverbooked([FromRoute] string date, int destinationId) {
            return reservationRepo.IsOverbooked(date, destinationId);
        }

        [HttpGet("byDate/{date}/byDriver/{driverId}")]
        [Authorize(Roles = "admin")]
        public async Task<DriverResult<Reservation>> GetByDateAndDriver([FromRoute] string date, int driverId) {
            return await reservationRepo.GetByDateAndDriver(date, driverId);
        }

        [HttpGet("byRefNo/{refNo}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ReservationGroupResource<ReservationListResource>> GetByRefNo([FromRoute] string refNo) {
            return await reservationRepo.GetByRefNo(refNo);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<IActionResult> GetById(string id) {
            var record = await reservationRepo.GetById(id);
            if (await Identity.IsUserAdmin(httpContext) || await reservationRepo.IsUserOwner(record.Customer.Id)) {
                return StatusCode(200, record);
            } else {
                return StatusCode(490, new {
                    response = ApiMessages.NotOwnRecord()
                });
            }
        }

        [HttpPost]
        [Authorize(Roles = "user, admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PostReservationAsync([FromBody] ReservationWriteResource record) {
            var responseCode = reservationRepo.IsValid(record, scheduleRepo);
            if (responseCode == 200) {
                await AssignRefNoToNewReservation(record);
                AttachPortIdToRecord(record);
                await AttachUserIdToRecord(record);
                reservationRepo.Create(mapper.Map<ReservationWriteResource, Reservation>(record));
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = record.RefNo
                };
            } else {
                return new Response {
                    Code = responseCode,
                    Icon = Icons.Error.ToString(),
                    Message = GetMessage(responseCode)
                };
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "user, admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PutReservation([FromRoute] string id, [FromBody] ReservationWriteResource record) {
            await AttachUserIdToRecord(record);
            AttachPortIdToRecord(record);
            var responseCode = reservationRepo.IsValid(record, scheduleRepo);
            if (responseCode == 200) {
                record = reservationRepo.UpdateForeignKeysWithNull(record);
                await reservationRepo.Update(id, mapper.Map<ReservationWriteResource, Reservation>(record));
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = record.RefNo
                };
            } else {
                return new Response {
                    Code = responseCode,
                    Icon = Icons.Error.ToString(),
                    Message = GetMessage(responseCode)
                };
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteReservation([FromRoute] string id) {
            reservationRepo.Delete(await reservationRepo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        [HttpPatch("assignToDriver")]
        [Authorize(Roles = "admin")]
        public IActionResult AssignToDriver(int driverId, [FromQuery(Name = "id")] string[] ids) {
            reservationRepo.AssignToDriver(driverId, ids);
            return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
        }

        [HttpPatch("assignToShip")]
        [Authorize(Roles = "admin")]
        public IActionResult AssignToShip(int shipId, [FromQuery(Name = "id")] string[] ids) {
            reservationRepo.AssignToShip(shipId, ids);
            return StatusCode(200, new {
                response = ApiMessages.RecordUpdated()
            });
        }

        private async Task<ReservationWriteResource> AttachUserIdToRecord(ReservationWriteResource record) {
            var user = await Identity.GetConnectedUserId(httpContext);
            record.UserId = user.UserId;
            return record;
        }

        private ReservationWriteResource AttachPortIdToRecord(ReservationWriteResource record) {
            record.PortId = reservationRepo.GetPortIdFromPickupPointId(record);
            return record;
        }

        private async Task<ReservationWriteResource> AssignRefNoToNewReservation(ReservationWriteResource record) {
            record.RefNo = await reservationRepo.AssignRefNoToNewReservation(record);
            return record;
        }

        private static string GetMessage(int errorCode) {
            return errorCode switch {
                450 => ApiMessages.FKNotFoundOrInactive("Customer Id"),
                451 => ApiMessages.FKNotFoundOrInactive("Destination Id"),
                452 => ApiMessages.FKNotFoundOrInactive("Pickup point Id"),
                453 => ApiMessages.FKNotFoundOrInactive("Driver Id"),
                454 => ApiMessages.FKNotFoundOrInactive("Ship Id"),
                455 => ApiMessages.InvalidPassengerCount(),
                456 => ApiMessages.FKNotFoundOrInactive("Nationality Id for at least one passenger"),
                457 => ApiMessages.FKNotFoundOrInactive("Gender Id for at least one passenger"),
                458 => ApiMessages.FKNotFoundOrInactive("Occupant Id for at least one passenger"),
                432 => ApiMessages.DayHasNoSchedule(),
                430 => ApiMessages.DayHasNoScheduleForDestination(),
                427 => ApiMessages.PortHasNoDepartures(),
                433 => ApiMessages.PortHasNoVacancy(),
                409 => ApiMessages.DuplicateRecord(),
                459 => ApiMessages.SimpleUserNightRestrictions(),
                431 => ApiMessages.SimpleUserCanNotAddReservationAfterDepartureTime(),
                _ => ApiMessages.RecordNotSaved()
            };
        }

    }

}