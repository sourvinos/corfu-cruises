using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Seeker {

    [Route("api/[controller]")]
    public class SeekerController : ControllerBase {

        #region variables

        private readonly ISeekerCalendar seekerCalendar;

        #endregion

        public SeekerController(ISeekerCalendar seekerCalendar) {
            this.seekerCalendar = seekerCalendar;
        }

        [HttpGet("date/{date}/destinationId/{destinationId}/portId/{portId}")]
        [Authorize(Roles = "user, admin")]
        public IEnumerable<SeekerCalendarGroupVM> CalculateAvailability(string date, int destinationId, int portId) {
            return seekerCalendar.CalculateAccumulatedFreePaxPerPort(seekerCalendar.CalculateAccumulatedMaxPaxPerPort(seekerCalendar.CalculateAccumulatedPaxPerPort(seekerCalendar.GetPaxPerPort(seekerCalendar.GetForCalendar(date, destinationId, portId), seekerCalendar.GetReservations(date)))));
        }

    }

}