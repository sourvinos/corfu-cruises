using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CorfuCruises {

    [Authorize]
    [Route("api/[controller]")]

    public class BookingsController : ControllerBase {

        private readonly IBookingRepository repo;
        private readonly IEmailSender emailSender;
        private readonly ILogger<BookingsController> logger;
        private readonly IMapper mapper;

        public BookingsController(IBookingRepository repo, IEmailSender emailSender, ILogger<BookingsController> logger, IMapper mapper) {
            this.repo = repo;
            this.emailSender = emailSender;
            this.logger = logger;
            this.mapper = mapper;
        }

        [HttpGet("date/{date}")]
        public async Task<BookingGroupResultResource<BookingResource>> Get(string date) {
            return await this.repo.Get(date);
        }

        [HttpGet("destinationId/{destinationId}/portId/{portId}")]
        public IEnumerable<BookingPerDestinationAndPort> GetForDestinationAndPort(int destinationId, int portId) {
            var bookings = repo.GetForDestinationAndPort(destinationId, portId);
            return bookings;
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetBooking(int id) {
            var booking = await repo.GetById(id);
            if (booking == null) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            };
            return StatusCode(200, booking);
        }

        [HttpPost]
        public IActionResult PostBooking([FromBody] Booking record) {
            if (ModelState.IsValid) {
                try {
                    repo.Create(record);
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
        public IActionResult PutBooking([FromRoute] int id, [FromBody] Booking updatedRecord) {
            if (id == updatedRecord.BookingId && ModelState.IsValid) {
                try {
                    repo.UpdateWithDetails(id, updatedRecord);
                    return StatusCode(200, new {
                        response = ApiMessages.RecordUpdated()
                    });
                } catch (DbUpdateException exception) {
                    LoggerExtensions.LogException(0, logger, ControllerContext, updatedRecord, exception);
                    return StatusCode(490, new {
                        response = ApiMessages.RecordNotSaved()
                    });
                }
            }
            LoggerExtensions.LogException(0, logger, ControllerContext, updatedRecord, null);
            return StatusCode(400, new {
                response = ApiMessages.InvalidModel()
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking([FromRoute] int id) {
            Booking record = await repo.GetById(id);
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
        public IActionResult AssignToDriver(int driverId, [FromQuery(Name = "id")] int[] ids) {
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
       public IActionResult AssignToShip(int shipId, [FromQuery(Name = "id")] int[] ids) {
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
        public IActionResult SendVoucher([FromBody] Booking record) {
            if (ModelState.IsValid) {
                emailSender.SendVoucher(record);
                return StatusCode(200, new { response = ApiMessages.EmailInstructions() });
            }
            return StatusCode(400, new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
        }

    }

}