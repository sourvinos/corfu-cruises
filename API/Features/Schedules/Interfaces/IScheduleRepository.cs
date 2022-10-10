using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Schedules {

    public interface IScheduleRepository : IRepository<Schedule> {

        Task<IEnumerable<ScheduleListVM>> Get();
        IEnumerable<AvailabilityCalendarGroupVM> GetForCalendar(string fromDate, string toDate);
        Task<Schedule> GetById(int id, bool includeTables);
        Task<IEnumerable<Schedule>> GetRangeByIds(IEnumerable<int> ids);
        Task<List<ScheduleWriteDto>> AttachUserIdToNewDto(List<ScheduleWriteDto> schedules);
        ScheduleWriteDto AttachUserIdToUpdateDto(ScheduleWriteDto schedule);
        IEnumerable<AvailabilityCalendarGroupVM> CalculateAccumulatedMaxPaxPerPort(IEnumerable<AvailabilityCalendarGroupVM> schedules);
        IEnumerable<AvailabilityCalendarGroupVM> GetPaxPerPort(IEnumerable<AvailabilityCalendarGroupVM> schedule);
        IEnumerable<AvailabilityCalendarGroupVM> CalculateAccumulatedPaxPerPort(IEnumerable<AvailabilityCalendarGroupVM> schedules);

    }

}