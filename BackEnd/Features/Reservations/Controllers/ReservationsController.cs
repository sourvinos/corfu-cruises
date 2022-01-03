using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Features.Schedules;
using BlueWaterCruises.Infrastructure.Extensions;
using BlueWaterCruises.Infrastructure.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BlueWaterCruises.Features.Reservations {

    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase {

        #region variables

        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMapper mapper;
        private readonly IReservationRepository reservationRepo;
        private readonly IScheduleRepository scheduleRepo;

        #endregion

        public ReservationsController(IHttpContextAccessor httpContextAccessor, IMapper mapper, IReservationRepository reservationRepo, IScheduleRepository scheduleRepo) {
            this.httpContextAccessor = httpContextAccessor;
            this.mapper = mapper;
            this.reservationRepo = reservationRepo;
            this.scheduleRepo = scheduleRepo;
        }

        [HttpGet("date/{date}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ReservationGroupResource<ReservationListResource>> Get([FromRoute] string date) {
            return await reservationRepo.Get(date);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<IActionResult> GetReservation(string id) {
            var record = await reservationRepo.GetById(id);
            if (await Identity.IsUserAdmin(httpContextAccessor) || await reservationRepo.DoesUserOwnRecord(record.UserId)) {
                return StatusCode(200, new {
                    response = record
                });
            }
            else {
                return StatusCode(490, new {
                    response = ApiMessages.NotOwnRecord()
                });
            }
        }

        [HttpPost]
        [Authorize(Roles = "user, admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PostReservation([FromBody] ReservationWriteResource record) {
            var response = reservationRepo.IsValid(record, scheduleRepo);
            if (response == 200) {
                _ = AttachPortIdToRecord(record);
                _ = AttachUserIdToRecord(record);
                reservationRepo.Create(mapper.Map<ReservationWriteResource, Reservation>(record));
                return StatusCode(200, new {
                    response = ApiMessages.RecordCreated()
                });
            }
            else {
                return GetErrorMessage(response);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "user, admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<IActionResult> PutReservation([FromRoute] string id, [FromBody] ReservationWriteResource record) {
            AttachUserIdToRecord(record);
            if (await Identity.IsUserAdmin(httpContextAccessor) || await reservationRepo.DoesUserOwnRecord(record.UserId)) {
                var response = reservationRepo.IsValid(record, scheduleRepo);
                if (response == 200) {
                    reservationRepo.Update(id, mapper.Map<ReservationWriteResource, Reservation>(record));
                    return StatusCode(200, new {
                        response = ApiMessages.RecordUpdated()
                    });
                }
                else {
                    return this.GetErrorMessage(response);
                }
            }
            else {
                return StatusCode(401, new {
                    response = ApiMessages.NotOwnRecord()
                });
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

        private IActionResult GetErrorMessage(int errorCode) {
            return errorCode switch {
                450 => StatusCode(450, new { response = ApiMessages.InvalidCustomerId() }),
                451 => StatusCode(451, new { response = ApiMessages.InvalidDestinationId() }),
                452 => StatusCode(452, new { response = ApiMessages.InvalidPickupPointId() }),
                431 => StatusCode(431, new { response = ApiMessages.UserCanNotAddReservationInThePast() }),
                432 => StatusCode(432, new { response = ApiMessages.DayHasNoSchedule() }),
                430 => StatusCode(430, new { response = ApiMessages.DayHasNoScheduleForDestination() }),
                427 => StatusCode(427, new { response = ApiMessages.PortHasNoDepartures() }),
                433 => StatusCode(433, new { response = ApiMessages.PortHasNoVacancy() }),
                409 => StatusCode(409, new { response = ApiMessages.DuplicateRecord() }),
                _ => StatusCode(490, new { Response = ApiMessages.RecordNotSaved() }),
            };
        }

        private ReservationWriteResource AttachUserIdToRecord(ReservationWriteResource record) {
            record.UserId = Identity.GetConnectedUserId(httpContextAccessor);
            return record;
        }

        private ReservationWriteResource AttachPortIdToRecord(ReservationWriteResource record) {
            record.PortId = reservationRepo.GetPortIdFromPickupPointId(record);
            return record;
        }

    }

}