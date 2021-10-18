using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Schedules {

    public interface IScheduleRepository : IRepository<Schedule> {

        Task<IList<Schedule>> Get();
        Boolean DayHasSchedule(DateTime date);
        Boolean DayHasScheduleForDestination(DateTime date, int destinationId);
        Boolean PortHasDepartures(DateTime date, int destinationId, int portId);
        Boolean PortHasVacancy(DateTime date, int destinationId, int portId);
        IEnumerable<ScheduleReservationGroup> DoCalendarTasks(string fromDate, string toDate, Guid? reservationId);
        new Task<Schedule> GetById(int ScheduleId);
        List<Schedule> Create(List<Schedule> entity);
        void RemoveRange(List<Schedule> schedules);

    }

}