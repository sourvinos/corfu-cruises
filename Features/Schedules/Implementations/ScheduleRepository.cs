using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class ScheduleRepository : Repository<Schedule>, IScheduleRepository {

        private readonly IMapper mapper;

        public ScheduleRepository(DbContext context, IMapper mapper) : base(context) {
            this.mapper = mapper;
        }

        public async Task<IList<Schedule>> Get() {
            return await context.Schedules.Include(p => p.Port).Include(p => p.Destination).ToListAsync();
        }

        public async Task<IList<ScheduleReadResource>> GetForDestination(int destinationId) {
            var schedules = await context.Schedules
               .Where(x => x.DestinationId == destinationId)
               .OrderBy(p => p.Date).ThenBy(p => p.PortId)
               .ToListAsync();
            return mapper.Map<IList<Schedule>, IList<ScheduleReadResource>>(schedules);
        }

        public new async Task<Schedule> GetById(int ScheduleId) {
            return await context.Schedules.Include(p => p.Port).Include(p => p.Destination).SingleOrDefaultAsync(m => m.Id == ScheduleId);
        }

        public List<Schedule> Create(List<Schedule> entity) {
            context.AddRange(entity);
            context.SaveChanges();
            return entity;
        }

        public void RemoveRange(List<Schedule> schedules) {
            List<Schedule> idsToDelete = new List<Schedule>();
            foreach (var item in schedules) {
                var idToDelete = context.Schedules.FirstOrDefault(x => x.Date == item.Date && x.DestinationId == item.DestinationId && x.PortId == item.PortId);
                if (idToDelete != null) {
                    idsToDelete.Add(idToDelete);
                }
            }
            if (idsToDelete.Count() > 0) {
                context.RemoveRange(idsToDelete);
                context.SaveChanges();
            }
        }

    }

}