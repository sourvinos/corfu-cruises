using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises {

    public interface IScheduleRepository : IRepository<Schedule> {

        Task<IList<Schedule>> Get();
        Boolean GetForDate(string date);
        Task<IList<ScheduleReadResource>> GetForDestination(int destinationId);
        ScheduleReadResource GetForDateAndDestination(string date, int destinationId);
        ScheduleReadResource GetForDateAndDestinationAndPort(string date, int destinationId, int portId);
        new Task<Schedule> GetById(int ScheduleId);
        List<Schedule> Create(List<Schedule> entity);
        void RemoveRange(List<Schedule> schedules);

    }

}