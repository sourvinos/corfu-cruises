using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IScheduleRepository : IRepository<Schedule> {

        Task<IList<Schedule>> Get();
        Boolean GetForDate(string date);
        Task<IList<ScheduleReadResource>> GetForDestination(int destinationId);
        bool GetForDateDestinationPort(string date, int destinationId, int portId);
        new Task<Schedule> GetById(int ScheduleId);
        List<Schedule> Create(List<Schedule> entity);
        void RemoveRange(List<Schedule> schedules);

    }

}