using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Schedules {

    public interface IScheduleRepository : IRepository<Schedule> {

        Task<IList<Schedule>> Get();
        Boolean IsSchedule(DateTime date);
        Task<IList<ScheduleReadResource>> GetForDestination(int destinationId);
        ScheduleReadResource GetForDateAndDestination(DateTime date, int destinationId);
        ScheduleReadResource GetForDateAndDestinationAndPort(DateTime date, int destinationId, int portId);
        new Task<Schedule> GetById(int ScheduleId);
        List<Schedule> Create(List<Schedule> entity);
        void RemoveRange(List<Schedule> schedules);

        IEnumerable<ScheduleReservationGroup> DoTasks(string fromDate, string toDate);

    }

}