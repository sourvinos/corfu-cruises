using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CorfuCruises {

    [Route("api/[controller]")]

    public class WebController : ControllerBase {

        private readonly IWebRepository repo;
        private readonly IPickupPointRepository pickupPointRepo;
        private readonly IEmailSender emailSender;
        private readonly ILogger<WebController> logger;
        private readonly IMapper mapper;
        private readonly WebDefaultSettings settings;

        public WebController(IWebRepository repo, IPickupPointRepository pickupPointRepo, IEmailSender emailSender, ILogger<WebController> logger, IMapper mapper, IOptions<WebDefaultSettings> settings) {
            this.repo = repo;
            this.pickupPointRepo = pickupPointRepo;
            this.emailSender = emailSender;
            this.logger = logger;
            this.mapper = mapper;
            this.settings = settings.Value;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWeb(string id) {
            var record = await repo.GetById(id);
            if (record == null) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            };
            return StatusCode(200, mapper.Map<Reservation, ReservationReadResource>(record));
        }

        [HttpGet("[action]/date/{date}/destinationId/{destinationId}/portId/{portId}")]
        public ReservationTotalPersons GetForDateDestinationPort(string date, int destinationId, int portId) {
            return repo.GetForDateDestinationPort(date, destinationId, portId);
        }

        [HttpPost]
        public IActionResult PostWeb([FromBody] WebWriteResource recordResource) {
            if (ModelState.IsValid) {
                try {
                    var reservation = repo.Create(UpdateReservationWithDefaultFields(recordResource));
                    var controller = HttpContext.Request.Path.ToString().Split("/");
                    return StatusCode(200, new {
                        response = HttpContext.Request.Scheme + "://" + HttpContext.Request.Host + "/" + controller[2] + "/" + reservation.ReservationId
                    });
                } catch (Exception exception) {
                    LoggerExtensions.LogException(0, logger, ControllerContext, recordResource, exception);
                    return StatusCode(490, new {
                        response = ApiMessages.RecordNotSaved()
                    });
                }
            }
            LoggerExtensions.LogException(0, logger, ControllerContext, recordResource, null);
            return StatusCode(400, new {
                response = ApiMessages.InvalidModel()
            });
        }

        [HttpPut("{id}")]
        public IActionResult PutReservation([FromRoute] string id, [FromBody] ReservationWriteResource record) {
            if (id == record.ReservationId.ToString() && ModelState.IsValid) {
                try {
                    if (repo.Update(id, mapper.Map<ReservationWriteResource, Reservation>(record))) {
                        return StatusCode(200, new {
                            response = ApiMessages.RecordUpdated()
                        });
                    } else {
                        return StatusCode(490, new {
                            response = ApiMessages.RecordNotSaved()
                        });
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

        [HttpPost("[action]")]
        public IActionResult SendVoucher([FromBody] string email) {
            if (ModelState.IsValid) {
                emailSender.EmailVoucher(email);
                return StatusCode(200, new { response = ApiMessages.EmailInstructions() });
            }
            return StatusCode(400, new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
        }

        private Reservation UpdateReservationWithDefaultFields(WebWriteResource recordResource) {
            var reservation = mapper.Map<WebWriteResource, Reservation>(recordResource);
            reservation.CustomerId = settings.CustomerId;
            reservation.PortId = GetPortId(recordResource.PickupPointId);
            reservation.ShipId = settings.ShipId;
            reservation.DriverId = settings.DriverId;
            reservation.TicketNo = settings.TicketNo;
            reservation.UserId = settings.UserId;
            return reservation;
        }

        private int GetPortId(int pickupPointId) {
            return pickupPointRepo.GetPortId(pickupPointId);
        }

    }

}