using System.Collections.Generic;
using System.Threading.Tasks;
using API.Features.Invoicing;
using API.Features.Schedules;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
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
            if (await Identity.IsUserAdmin(httpContext) || await reservationRepo.DoesUserOwnRecord(record.Customer.Id)) {
                return StatusCode(200, record);
            } else {
                return StatusCode(490, new {
                    response = ApiMessages.NotOwnRecord()
                });
            }
        }

        [HttpGet("fromDate/{fromDate}/toDate/{toDate}")]
        [Authorize(Roles = "user, admin")]
        public Task<IEnumerable<InvoicingReportVM>> GetInvoicing(string fromDate, string toDate) {
            return reservationRepo.GetSimpleUserInvoicing(fromDate, toDate);
        }

        [HttpPost]
        [Authorize(Roles = "user, admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<IActionResult> PostReservationAsync([FromBody] ReservationWriteResource record) {
            var response = reservationRepo.IsValid(record, scheduleRepo);
            if (response == 200) {
                await AssignRefNoToNewReservation(record);
                AttachPortIdToRecord(record);
                await AttachUserIdToRecord(record);
                reservationRepo.Create(mapper.Map<ReservationWriteResource, Reservation>(record));
                return StatusCode(200, new {
                    message = record.RefNo
                });
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "user, admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<IActionResult> PutReservation([FromRoute] string id, [FromBody] ReservationWriteResource record) {
            await AttachUserIdToRecord(record);
            var response = reservationRepo.IsValid(record, scheduleRepo);
            record = reservationRepo.UpdateForeignKeysWithNull(record);
            if (response == 200) {
                await reservationRepo.Update(id, mapper.Map<ReservationWriteResource, Reservation>(record));
                return StatusCode(200, new {
                    message = record.RefNo
                });
            } else {
                return GetErrorMessage(response);
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

        private IActionResult GetErrorMessage(int errorCode) {
            return errorCode switch {
                450 => StatusCode(450, new { response = ApiMessages.FKNotFoundOrInactive("Customer Id") }),
                451 => StatusCode(451, new { response = ApiMessages.FKNotFoundOrInactive("Destination Id") }),
                452 => StatusCode(452, new { response = ApiMessages.FKNotFoundOrInactive("Pickup point Id") }),
                453 => StatusCode(453, new { response = ApiMessages.FKNotFoundOrInactive("Driver Id") }),
                454 => StatusCode(454, new { response = ApiMessages.FKNotFoundOrInactive("Ship Id") }),
                455 => StatusCode(455, new { response = ApiMessages.InvalidPassengerCount() }),
                456 => StatusCode(456, new { response = ApiMessages.FKNotFoundOrInactive("Nationality Id for at least one passenger") }),
                457 => StatusCode(457, new { response = ApiMessages.FKNotFoundOrInactive("Gender Id for at least one passenger") }),
                458 => StatusCode(458, new { response = ApiMessages.FKNotFoundOrInactive("Occupant Id for at least one passenger") }),
                432 => StatusCode(432, new { response = ApiMessages.DayHasNoSchedule() }),
                430 => StatusCode(430, new { response = ApiMessages.DayHasNoScheduleForDestination() }),
                427 => StatusCode(427, new { response = ApiMessages.PortHasNoDepartures() }),
                433 => StatusCode(433, new { response = ApiMessages.PortHasNoVacancy() }),
                409 => StatusCode(409, new { response = ApiMessages.DuplicateRecord() }),
                459 => StatusCode(459, new { response = ApiMessages.SimpleUserNightRestrictions() }),
                431 => StatusCode(431, new { response = ApiMessages.SimpleUserCanNotAddReservationAfterDepartureTime() }),
                _ => StatusCode(490, new { Response = ApiMessages.RecordNotSaved() }),
            };
        }

    }

}