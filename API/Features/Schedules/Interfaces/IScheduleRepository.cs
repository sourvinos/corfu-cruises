using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Schedules {

    public interface IScheduleRepository : IRepository<Schedule> {

        Task<IEnumerable<ScheduleListViewModel>> GetForList();
        IEnumerable<ScheduleReservationGroup> DoCalendarTasks(string fromDate, string toDate, Guid? reservationId);
        bool PortHasDepartureForDateAndDestination(string date, int destinationId, int portId);
        new Task<ScheduleReadDto> GetById(int scheduleId);
        void Create(List<Schedule> entity);
        Task<Schedule> GetByIdToDelete(int id);
        void DeleteRange(List<ScheduleDeleteRangeDto> schedules);
        int IsValidOnNew(List<ScheduleWriteDto> records);
        int IsValidOnUpdate(ScheduleWriteDto record);

    }

}