using System.Collections.Generic;
using API.Infrastructure.Interfaces;

namespace API.Features.Schedules {

    public interface IScheduleCalendar : IRepository<Schedule> {

        IEnumerable<AvailabilityCalendarGroupVM> GetForCalendar(string fromDate, string toDate);
        IEnumerable<AvailabilityCalendarGroupVM> CalculateAccumulatedMaxPaxPerPort(IEnumerable<AvailabilityCalendarGroupVM> schedules);
        IEnumerable<AvailabilityCalendarGroupVM> GetPaxPerPort(IEnumerable<AvailabilityCalendarGroupVM> schedule);
        IEnumerable<AvailabilityCalendarGroupVM> CalculateAccumulatedPaxPerPort(IEnumerable<AvailabilityCalendarGroupVM> schedules);
        IEnumerable<AvailabilityCalendarGroupVM> CalculateAccumulatedFreePaxPerPort(IEnumerable<AvailabilityCalendarGroupVM> schedules);

    }

}