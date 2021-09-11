using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Schedules {

    public class ScheduleRepository : Repository<Schedule>, IScheduleRepository {

        private readonly IMapper mapper;
        private readonly UserManager<AppUser> userManager;

        public ScheduleRepository(DbContext context, IMapper mapper, UserManager<AppUser> userManager) : base(context) {
            this.mapper = mapper;
            this.userManager = userManager;
        }

        public async Task<IList<Schedule>> Get() {
            return await context.Schedules.Include(p => p.Port).Include(p => p.Destination).ToListAsync();
        }

        public Boolean IsSchedule(DateTime date) {
            var schedule = context.Schedules
                .Where(x => x.Date == date)
                .ToList();
            return schedule.Count() != 0;
        }

        public async Task<IList<ScheduleReadResource>> GetForDestination(int destinationId) {
            var schedules = await context.Schedules
                .Where(x => x.DestinationId == destinationId)
                .OrderBy(p => p.Date).ThenBy(p => p.PortId)
                .ToListAsync();
            return mapper.Map<IList<Schedule>, IList<ScheduleReadResource>>(schedules);
        }

        public ScheduleReadResource GetForDateAndDestination(DateTime date, int destinationId) {
            int maxPersons = 0;
            maxPersons = context.Schedules.Where(x => x.Date == date && x.DestinationId == destinationId).Sum(x => x.MaxPersons);
            var schedule = new ScheduleReadResource {
                Date = date.ToShortDateString(),
                DestinationId = destinationId,
                PortId = null,
                MaxPersons = maxPersons
            };
            return schedule;
        }

        public ScheduleReadResource GetForDateAndDestinationAndPort(DateTime date, int destinationId, int portId) {
            int maxPersons = 0;
            maxPersons = context.Schedules.Where(x => x.Date == date && x.DestinationId == destinationId && x.PortId == portId).Sum(x => x.MaxPersons);
            var schedule = new ScheduleReadResource {
                Date = date.ToShortDateString(),
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

        public IEnumerable<ScheduleReservationGroup> DoTasks(string fromDate, string toDate) {
            var schedule = this.GetScheduleForPeriod(fromDate, toDate);
            var reservations = this.GetReservationsForPeriod(fromDate, toDate);
            var joinedSheduleReservation = this.CalculateAvailability(schedule, reservations);
            return joinedSheduleReservation;
        }

        private IEnumerable<ScheduleResource> GetScheduleForPeriod(string fromDate, string toDate) {
            var response = context.Schedules
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate))
                .OrderBy(x => x.Date).ThenBy(x => x.DestinationId).ThenBy(x => x.PortId)
                .Select(x => new ScheduleResource {
                    Date = x.Date.ToString(),
                    DestinationId = x.DestinationId,
                    DestinationDescription = x.Destination.Description,
                    PortId = x.PortId,
                    PortDescription = x.Port.Description,
                    MaxPersons = x.MaxPersons
                })
                .ToList();
            return response;
        }

        private IEnumerable<ReservationResource> GetReservationsForPeriod(string fromDate, string toDate) {
            var response = context.Reservations
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate))
                .OrderBy(x => x.Date).ThenBy(x => x.DestinationId).ThenBy(x => x.PortId)
                .GroupBy(x => new { x.Date, x.DestinationId, x.PortId })
                .Select(x => new ReservationResource {
                    Date = x.Key.Date.ToString(),
                    DestinationId = x.Key.DestinationId,
                    PortId = x.Key.PortId,
                    TotalPersons = x.Sum(x => x.TotalPersons)
                });
            return response;
        }

        private IEnumerable<ScheduleReservationGroup> CalculateAvailability(IEnumerable<ScheduleResource> schedule, IEnumerable<ReservationResource> reservations) {
            foreach (var item in schedule) {
                var x = reservations.FirstOrDefault(x => x.Date == item.Date.ToString() && x.DestinationId == item.DestinationId && x.PortId == item.PortId);
                item.Persons = x != null ? x.TotalPersons : 0;
            }
            var response = schedule
                .GroupBy(x => x.Date)
                .Select(x => new ScheduleReservationGroup {
                    Date = x.Key,
                    Destinations = x.GroupBy(x => new { x.DestinationId, x.DestinationDescription }).Select(x => new DestinationResource {
                        Id = x.Key.DestinationId,
                        Description = x.Key.DestinationDescription,
                        Ports = x.GroupBy(x => new { x.PortId, x.PortDescription, x.MaxPersons, x.Persons }).Select(x => new PortResource {
                            Id = x.Key.PortId,
                            Description = x.Key.PortDescription,
                            MaxPersons = x.Key.MaxPersons,
                            Persons = x.Sum(x => x.Persons)
                        })
                    })
                });
            return response;
        }

    }

}