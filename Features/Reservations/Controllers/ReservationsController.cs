using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CorfuCruises {

    [Authorize]
    [Route("api/[controller]")]

    public class ReservationsController : ControllerBase {

        private readonly IReservationRepository repo;
        private readonly IEmailSender emailSender;
        private readonly ILogger<ReservationsController> logger;
        private readonly IMapper mapper;
        private readonly IConverter converter;

        public ReservationsController(IReservationRepository repo, IEmailSender emailSender, ILogger<ReservationsController> logger, IMapper mapper, IConverter converter) {
            this.repo = repo;
            this.emailSender = emailSender;
            this.logger = logger;
            this.mapper = mapper;
            this.converter = converter;
        }

        [HttpGet("userId/{userId}/date/{date}")]
        public async Task<ReservationGroupReadResource<ReservationReadResource>> Get(string userId, string date) {
            return await this.repo.Get(userId, date);
        }

        [HttpGet("[action]/destinationId/{destinationId}")]
        public IEnumerable<MainResult> GetForDestination(int destinationId) {
            var records = repo.GetForDestination(destinationId);
            return records;
        }

        [HttpGet("[action]/date/{date}/destinationId/{destinationId}/portId/{portId}")]
        public ReservationTotalPersons GetForDateAndDestinationAndPort(string date, int destinationId, int portId) {
            return repo.GetForDateAndDestinationAndPort(date, destinationId, portId);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReservation(string id) {
            var record = await repo.GetById(id);
            if (record == null) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            };
            return StatusCode(200, mapper.Map<Reservation, ReservationReadResource>(record));
        }

        [HttpPost]
        public IActionResult PostReservation([FromBody] ReservationWriteResource record) {
            if (ModelState.IsValid) {
                try {
                    repo.Create(mapper.Map<ReservationWriteResource, Reservation>(record));
                    return StatusCode(200, new {
                        response = ApiMessages.RecordCreated()
                    });
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation([FromRoute] string id) {
            Reservation record = await repo.GetById(id);
            if (record == null) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            try {
                repo.Delete(record);
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
        public IActionResult AssignToDriver(int driverId, [FromQuery(Name = "id")] string[] ids) {
            try {
                repo.AssignToDriver(driverId, ids);
                return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
            } catch (DbUpdateException exception) {
                LoggerExtensions.LogException(driverId, logger, ControllerContext, null, exception);
                return StatusCode(490, new {
                    response = ApiMessages.RecordNotSaved()
                });
            }
        }

        [HttpPatch("assignToShip")]
        public IActionResult AssignToShip(int shipId, [FromQuery(Name = "id")] string[] ids) {
            try {
                repo.AssignToShip(shipId, ids);
                return StatusCode(200, new { response = ApiMessages.RecordUpdated() });
            } catch (DbUpdateException exception) {
                LoggerExtensions.LogException(shipId, logger, ControllerContext, null, exception);
                return StatusCode(490, new {
                    response = ApiMessages.RecordNotSaved()
                });
            }
        }

        [HttpPost("[action]")]
        public IActionResult EmailVoucher([FromBody] Voucher record) {
            if (ModelState.IsValid) {
                emailSender.EmailVoucher(record);
                return StatusCode(200, new { response = ApiMessages.EmailInstructions() });
            }
            return StatusCode(400, new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
        }

        [HttpGet("[action]")]
        public IActionResult PrintVoucher([FromBody] Voucher voucher) {

            var passengers = "";
            var globalSettings = new GlobalSettings {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings { Top = 10 },
                DocumentTitle = "Voucher"
            };

            foreach (var passenger in voucher.Passengers) {
                passengers += passenger.Lastname + " " + passenger.Firstname + "<br />";
            }

            var body = "Date: " + voucher.Date + "<br />" +
                    "Destination: " + voucher.DestinationDescription + "<br />" +
                    "Pickup point" + "<br />" +
                        "Description: " + voucher.PickupPointDescription + "<br />" +
                        "Exact point: " + voucher.PickupPointExactPoint + "<br />" +
                        "Time: " + voucher.PickupPointTime + "<br />" +
                    "Phones: " + voucher.Phones + "<br />" +
                    "Remarks: " + voucher.Remarks + "<br />" +
                    "<br />" +
                    "Passengers " + "<br />" + passengers +
                    "<div style='align-items: center; display: flex; height: 200px; justify-content: center; margin-bottom: 1rem; margin-top: 1rem; width: 200px;'>" +
                        "<img src=" + voucher.URI + " />" + "<br />" +
                    "</div>";

            var objectSettings = new ObjectSettings {
                PagesCount = true,
                HtmlContent = TemplateGenerator.GetHtmlString(body),
                WebSettings = { DefaultEncoding = "utf-8" },
                HeaderSettings = { FontName = "Arial", FontSize = 9, Right = "Page [page] of [toPage]", Line = true },
                FooterSettings = { FontName = "Arial", FontSize = 9, Line = true, Center = "Report Footer" }
            };

            var pdf = new HtmlToPdfDocument {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };

            converter.Convert(pdf);

            var file = converter.Convert(pdf);

            return File(file, "application/pdf");

        }
 
    }

}