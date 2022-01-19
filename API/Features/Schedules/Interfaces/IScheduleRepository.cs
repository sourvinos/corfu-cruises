using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Schedules {

    public interface IScheduleRepository : IRepository<Schedule> {

        Task<IEnumerable<ScheduleListResource>> GetForList();
        IEnumerable<ScheduleReservationGroup> DoCalendarTasks(string fromDate, string toDate, Guid? reservationId);
        bool DayHasSchedule(DateTime date);
        bool DayHasScheduleForDestination(DateTime date, int destinationId);
        bool PortHasDepartures(DateTime date, int destinationId, int portId);
        new Task<ScheduleReadResource> GetById(int scheduleId);
        List<Schedule> Create(List<Schedule> entity);
        Task<Schedule> GetByIdToDelete(int id);
        void DeleteRange(List<Schedule> schedules);
        int IsValidOnNew(List<ScheduleWriteResource> records);
        int IsValidOnUpdate(ScheduleWriteResource record);

    }

}