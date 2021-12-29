using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Interfaces;

namespace BlueWaterCruises.Features.Schedules {

    public interface IScheduleRepository : IRepository<Schedule> {

        Task<IEnumerable<ScheduleListResource>> GetForList();
        IEnumerable<ScheduleReservationGroup> DoCalendarTasks(string fromDate, string toDate, Guid? reservationId);
        Boolean DayHasSchedule(DateTime date);
        Boolean DayHasScheduleForDestination(DateTime date, int destinationId);
        Boolean PortHasDepartures(DateTime date, int destinationId, int portId);
        new Task<ScheduleReadResource> GetById(int scheduleId);
        List<Schedule> Create(List<Schedule> entity);
        Task<Schedule> GetByIdToDelete(int id);
        void DeleteRange(List<Schedule> schedules);

    }

}