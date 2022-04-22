using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Availability {

    [Route("api/[controller]")]
    public class AvailabilityController : ControllerBase {

        #region variables

        private readonly IAvailabilityRepository repo;

        #endregion

        public AvailabilityController(IAvailabilityRepository repo) {
            this.repo = repo;
        }

        [HttpGet("from/{fromdate}/to/{todate}")]
        [Authorize(Roles = "user, admin")]
        public IEnumerable<AvailabilityVM> GetForCalendar(string fromDate, string toDate) {
            return repo.DoCalendarTasks(fromDate, toDate);
        }

    }

}