using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Availability {

    [Route("api/[controller]")]
    public class AvailabilityController : ControllerBase {

        #region variables

        private readonly IAvailabilityCalendar availabilityCalendar;

        #endregion

        public AvailabilityController(IAvailabilityCalendar availabilityCalendar) {
            this.availabilityCalendar = availabilityCalendar;
        }

        [HttpGet("fromDate/{fromDate}/toDate/{toDate}")]
        [Authorize(Roles = "user, admin")]
        public IEnumerable<AvailabilityCalendarGroupVM> GetForCalendar([FromRoute] string fromDate, string toDate) {
            return availabilityCalendar.CalculateAccumulatedFreePaxPerPort(availabilityCalendar.CalculateAccumulatedMaxPaxPerPort(availabilityCalendar.CalculateAccumulatedPaxPerPort(availabilityCalendar.GetPaxPerPort(availabilityCalendar.GetForCalendar(fromDate, toDate), availabilityCalendar.GetReservations(fromDate, toDate)))));
        }

    }

}