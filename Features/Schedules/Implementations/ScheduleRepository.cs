using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ShipCruises {

    public class ScheduleRepository : Repository<Schedule>, IScheduleRepository {

        private readonly IMapper mapper;

        public ScheduleRepository(DbContext context, IMapper mapper) : base(context) {
            this.mapper = mapper;
        }

        public async Task<IList<Schedule>> Get() {
            return await context.Schedules.Include(p => p.Port).Include(p => p.Destination).ToListAsync();
        }

        public Boolean GetForDate(string date) {
            var schedule = context.Schedules
                .Where(x => x.Date == date)
                .ToList();
            return schedule.Count() != 0;
        }

        public async Task<IList<ScheduleReadResource>> GetForDestination(int destinationId) {
            var schedules = await context.Schedules
                .Where(x => x.DestinationId == destinationId)
                .OrderBy(p => p.Date)
                    .ThenBy(p => p.PortId)
                .ToListAsync();
            return mapper.Map<IList<Schedule>, IList<ScheduleReadResource>>(schedules);
        }

        public ScheduleReadResource GetForDateAndDestination(string date, int destinationId) {
            int maxPersons = 0;
            maxPersons = context.Schedules.Where(x => x.Date == date && x.DestinationId == destinationId).Sum(x => x.MaxPersons);
            var schedule = new ScheduleReadResource {
                Date = date,
                DestinationId = destinationId,
                PortId = null,
                MaxPersons = maxPersons
            };
            return schedule;
        }

        public ScheduleReadResource GetForDateAndDestinationAndPort(string date, int destinationId, int portId) {
            int maxPersons = 0;
            maxPersons = context.Schedules.Where(x => x.Date == date && x.DestinationId == destinationId && x.PortId == portId).Sum(x => x.MaxPersons);
            var schedule = new ScheduleReadResource {
                Date = date,
                DestinationId = destinationId,
                PortId = portId,
                MaxPersons = maxPersons
            };
            return schedule;
        }

        public new async Task<Schedule> GetById(int ScheduleId) {
            return await context.Schedules
                .Include(p => p.Port)
                .Include(p => p.Destination)
                .SingleOrDefaultAsync(m => m.Id == ScheduleId);
        }

        public List<Schedule> Create(List<Schedule> entity) {
            context.AddRange(entity);
            context.SaveChanges();
            return entity;
        }

        public void RemoveRange(List<Schedule> schedules) {
            List<Schedule> idsToDelete = new List<Schedule>();
            foreach (var item in schedules) {
                var idToDelete = context.Schedules
                    .FirstOrDefault(x => x.Date == item.Date && x.DestinationId == item.DestinationId && x.PortId == item.PortId);
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