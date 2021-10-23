using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Schedules {

    public interface IScheduleRepository : IRepository<Schedule> {

        Task<IEnumerable<ScheduleListResource>> Get();
        Boolean DayHasSchedule(DateTime date);
        Boolean DayHasScheduleForDestination(DateTime date, int destinationId);
        Boolean PortHasDepartures(DateTime date, int destinationId, int portId);
        Boolean PortHasVacancy(DateTime date, int destinationId, int portId);
        IEnumerable<ScheduleReservationGroup> DoCalendarTasks(string fromDate, string toDate, Guid? reservationId);
        new Task<ScheduleReadResource> GetById(int ScheduleId);
        List<Schedule> Create(List<Schedule> entity);
        void RemoveRange(List<Schedule> schedules);
        Task<Schedule> GetSingleToDelete(int id);

    }

}