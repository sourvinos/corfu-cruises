using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Schedules {

    public interface IScheduleRepository : IRepository<Schedule> {

        Task<IEnumerable<ScheduleListVM>> Get();
        Task<Schedule> GetById(int id, bool includeTables);
        Task<List<ScheduleWriteDto>> AttachUserIdToNewDto(List<ScheduleWriteDto> schedules);
        Task<ScheduleWriteDto> AttachUserIdToUpdateDto(ScheduleWriteDto schedule);

    }

}