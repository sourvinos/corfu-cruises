using System.Collections.Generic;
using API.Features.Schedules;
using API.Infrastructure.Interfaces;

namespace API.Features.Availability {

    public interface IAvailabilityCalendar : IRepository<Schedule> {

        IEnumerable<AvailabilityCalendarGroupVM> GetForCalendar(string fromDate, string toDate);
        IEnumerable<AvailabilityCalendarGroupVM> CalculateAccumulatedMaxPaxPerPort(IEnumerable<AvailabilityCalendarGroupVM> schedules);
        IEnumerable<AvailabilityCalendarGroupVM> GetPaxPerPort(IEnumerable<AvailabilityCalendarGroupVM> schedule, IEnumerable<ReservationVM> reservations);
        IEnumerable<AvailabilityCalendarGroupVM> CalculateAccumulatedPaxPerPort(IEnumerable<AvailabilityCalendarGroupVM> schedules);
        IEnumerable<AvailabilityCalendarGroupVM> CalculateAccumulatedFreePaxPerPort(IEnumerable<AvailabilityCalendarGroupVM> schedules);
        IEnumerable<ReservationVM> GetReservations(string fromDate, string toDate);

    }

}