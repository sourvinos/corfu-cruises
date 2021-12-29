using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BlueWaterCruises.Features.Schedules {

    public class ScheduleRepository : Repository<Schedule>, IScheduleRepository {

        private readonly IMapper mapper;

        public ScheduleRepository(AppDbContext context, IMapper mapper, IOptions<TestingEnvironment> settings) : base(context, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ScheduleListResource>> GetForList() {
            var schedules = await context.Set<Schedule>()
                .Include(x => x.Destination)
                .Include(x => x.Port)
                .OrderBy(x => x.Date)
                    .ThenBy(x => x.Destination.Description)
                        .ThenBy(x => x.Port.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Schedule>, IEnumerable<ScheduleListResource>>(schedules);
        }

        public IEnumerable<ScheduleReservationGroup> DoCalendarTasks(string fromDate, string toDate, Guid? reservationId) {
            this.GetScheduleForPeriod(fromDate, toDate);
            this.GetReservationsForPeriod(fromDate, toDate, reservationId);
            var calendarData = UpdateCalendarData(this.GetScheduleForPeriod(fromDate, toDate), this.GetReservationsForPeriod(fromDate, toDate, reservationId));
            return calendarData;
        }

        public Boolean DayHasSchedule(DateTime date) {
            var schedule = context.Set<Schedule>()
                .Where(x => x.Date == date)
                .ToList();
            return schedule.Count != 0;
        }

        public Boolean DayHasScheduleForDestination(DateTime date, int destinationId) {
            var schedule = context.Set<Schedule>()
                .Where(x => x.Date == date && x.DestinationId == destinationId)
                .ToList();
            return schedule.Count != 0;
        }

        public Boolean PortHasDepartures(DateTime date, int destinationId, int portId) {
            var schedule = context.Set<Schedule>()
                .Where(x => x.Date == date && x.DestinationId == destinationId && x.PortId == portId)
                .ToList();
            return schedule.Count != 0;
        }

        new public async Task<ScheduleReadResource> GetById(int scheduleId) {
            var record = await context.Set<Schedule>()
                .Include(p => p.Port)
                .Include(p => p.Destination)
                .SingleOrDefaultAsync(m => m.Id == scheduleId);
            return mapper.Map<Schedule, ScheduleReadResource>(record);
        }

        public List<Schedule> Create(List<Schedule> entities) {
            context.AddRange(entities);
            context.SaveChanges();
            return entities;
        }

        public async Task<Schedule> GetByIdToDelete(int id) {
            return await context.Set<Schedule>().FirstAsync(x => x.Id == id);
        }

        public void DeleteRange(List<Schedule> schedules) {
            List<Schedule> idsToDelete = new();
            foreach (var item in schedules) {
                var idToDelete = context.Set<Schedule>()
                    .FirstOrDefault(x => x.Date == item.Date && x.DestinationId == item.DestinationId && x.PortId == item.PortId);
                if (idToDelete != null) {
                    idsToDelete.Add(idToDelete);
                }
            }
            if (idsToDelete.Count > 0) {
                context.RemoveRange(idsToDelete);
                context.SaveChanges();
            }
        }

        private IEnumerable<ScheduleResource> GetScheduleForPeriod(string fromDate, string toDate) {
            var response = context.Set<Schedule>()
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate))
                .OrderBy(x => x.Date).ThenBy(x => x.DestinationId).ThenBy(x => x.PortId)
                .Select(x => new ScheduleResource {
                    Date = x.Date.ToString(),
                    DestinationId = x.DestinationId,
                    DestinationDescription = x.Destination.Description,
                    DestinationAbbreviation = x.Destination.Abbreviation,
                    PortId = x.PortId,
                    PortDescription = x.Port.Description,
                    IsPortPrimary = x.Port.IsPrimary,
                    MaxPersons = x.MaxPersons
                });
            return response.ToList();
        }

        private IEnumerable<ReservationResource> GetReservationsForPeriod(string fromDate, string toDate, Guid? reservationId) {
            var response = context.Set<Reservation>()
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate) && x.ReservationId != reservationId)
                .OrderBy(x => x.Date).ThenBy(x => x.DestinationId).ThenBy(x => x.PortId)
                .GroupBy(x => new { x.Date, x.DestinationId, x.PortId })
                .Select(x => new ReservationResource {
                    Date = x.Key.Date.ToString(),
                    DestinationId = x.Key.DestinationId,
                    PortId = x.Key.PortId,
                    TotalPersons = x.Sum(x => x.TotalPersons)
                });
            return response.ToList();
        }

        private static IEnumerable<ScheduleReservationGroup> UpdateCalendarData(IEnumerable<ScheduleResource> schedule, IEnumerable<ReservationResource> reservations) {
            foreach (var item in schedule) {
                var x = reservations.FirstOrDefault(x => x.Date == item.Date && x.DestinationId == item.DestinationId && x.PortId == item.PortId);
                item.Persons = (x?.TotalPersons) ?? 0;
            }
            var response = schedule
                .GroupBy(x => x.Date)
                .Select(x => new ScheduleReservationGroup {
                    Date = x.Key,
                    Destinations = x.GroupBy(x => new { x.Date, x.DestinationId, x.DestinationDescription })
                    .Select(x => new DestinationResource {
                        Id = x.Key.DestinationId,
                        Description = x.Key.DestinationDescription,
                        PassengerCount = CalculatePassengerCountForDestination(reservations, x.Key.Date, x.Key.DestinationId),
                        AvailableSeats = CalculateAvailableSeatsForAllPorts(schedule, reservations, x.Key.Date, x.Key.DestinationId),
                        Ports = x.GroupBy(x => new { x.PortId, x.Date, x.DestinationId, x.PortDescription, x.IsPortPrimary, x.MaxPersons })
                        .Select(x => new PortResource {
                            Id = x.Key.PortId,
                            Description = x.Key.PortDescription,
                            IsPrimary = x.Key.IsPortPrimary,
                            MaxPassengers = x.Key.MaxPersons,
                            PassengerCount = x.Sum(x => x.Persons),
                            AvailableSeats = CalculateAvailableSeatsForPort(schedule, x.Key.Date, x.Key.DestinationId, x.Key.MaxPersons, x.Sum(x => x.Persons), x.Key.IsPortPrimary)
                        })
                    })
                });
            return response.ToList();
        }

        private static int CalculateAvailableSeatsForAllPorts(IEnumerable<ScheduleResource> schedule, IEnumerable<ReservationResource> reservations, string date, int destinationId) {
            var maxPersons = CalculateMaxPersons(schedule, date, destinationId);
            var passengers = CalculatePassengerCountForDestination(reservations, date, destinationId);
            return maxPersons - passengers;
        }

        private static int CalculateAvailableSeatsForPort(IEnumerable<ScheduleResource> schedule, string date, int destinationId, int max, int persons, bool isPortPrimary) {
            if (isPortPrimary) {
                var empty = max - persons;
                return empty;
            } else {
                var primaryPort = schedule.FirstOrDefault(x => x.Date == date && x.DestinationId == destinationId && x.IsPortPrimary);
                if (primaryPort != null) {
                    var emptyForPrimaryPort = primaryPort.MaxPersons - primaryPort.Persons;
                    var empty = emptyForPrimaryPort + max - persons;
                    return empty;
                } else {
                    var empty = max - persons;
                    return empty;
                }
            }
        }

        private static int CalculatePassengerCountForDestination(IEnumerable<ReservationResource> reservations, string date, int destinationId) {
            return reservations.Where(x => x.Date == date && x.DestinationId == destinationId).Sum(x => x.TotalPersons);
        }

        private static int CalculateMaxPersons(IEnumerable<ScheduleResource> schedule, string date, int destinationId) {
            return schedule.Where(x => x.Date == date && x.DestinationId == destinationId).Sum(x => x.MaxPersons);
        }

    }

}