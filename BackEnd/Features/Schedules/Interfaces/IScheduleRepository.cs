using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Schedules {

    public interface IScheduleRepository : IRepository<Schedule> {

        Task<IEnumerable<ScheduleListResource>> GetForList();
        IEnumerable<ScheduleReservationGroup> DoCalendarTasks(string fromDate, string toDate, Guid? reservationId);
        Boolean DayHasSchedule(DateTime date);
        Boolean DayHasScheduleForDestination(DateTime date, int destinationId);
        Boolean PortHasDepartures(DateTime date, int destinationId, int portId);
        new Task<ScheduleReadResource> GetById(int ScheduleId);
        List<Schedule> Create(List<Schedule> entity);
        Task<Schedule> GetSingleToDelete(int id);
        void RemoveRange(List<Schedule> schedules);

    }

}