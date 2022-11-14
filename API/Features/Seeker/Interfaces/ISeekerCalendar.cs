using System.Collections.Generic;
using API.Features.Schedules;
using API.Infrastructure.Interfaces;

namespace API.Features.Seeker {

    public interface ISeekerCalendar : IRepository<Schedule> {

        IEnumerable<SeekerCalendarGroupVM> GetForCalendar(string date, int destinationId, int portId);
        IEnumerable<SeekerCalendarGroupVM> CalculateAccumulatedMaxPaxPerPort(IEnumerable<SeekerCalendarGroupVM> schedules);
        IEnumerable<SeekerCalendarGroupVM> GetPaxPerPort(IEnumerable<SeekerCalendarGroupVM> schedule, IEnumerable<ReservationVM> reservations);
        IEnumerable<SeekerCalendarGroupVM> CalculateAccumulatedPaxPerPort(IEnumerable<SeekerCalendarGroupVM> schedules);
        IEnumerable<SeekerCalendarGroupVM> CalculateAccumulatedFreePaxPerPort(IEnumerable<SeekerCalendarGroupVM> schedules);
        IEnumerable<ReservationVM> GetReservations(string date);

    }

}