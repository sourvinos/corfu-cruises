using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using API.Infrastructure.Middleware;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;

namespace API.Features.Schedules {

    public class ScheduleRepository : Repository<Schedule>, IScheduleRepository {

        private readonly IMapper mapper;
        private readonly TestingEnvironment settings;

        public ScheduleRepository(AppDbContext context, IMapper mapper, IOptions<TestingEnvironment> settings) : base(context, settings) {
            this.mapper = mapper;
            this.settings = settings.Value;
        }

        public async Task<IEnumerable<ScheduleListResource>> GetForList() {
            var schedules = await context.Set<Schedule>()
                .Include(x => x.Destination)
                .Include(x => x.Port)
                .OrderBy(x => x.Date).ThenBy(x => x.Destination.Description).ThenBy(x => x.Port.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Schedule>, IEnumerable<ScheduleListResource>>(schedules);
        }

        new public async Task<ScheduleReadResource> GetById(int scheduleId) {
            var record = await context.Set<Schedule>()
                .Include(p => p.Port)
                .Include(p => p.Destination)
                .SingleOrDefaultAsync(m => m.Id == scheduleId);
            if (record != null) {
                return mapper.Map<Schedule, ScheduleReadResource>(record);
            } else {
                throw new RecordNotFound(ApiMessages.RecordNotFound());
            }
        }

        public async Task<Schedule> GetByIdToDelete(int id) {
            return await context.Set<Schedule>().FirstAsync(x => x.Id == id);
        }

        public void Create(List<Schedule> entities) {
            using var transaction = context.Database.BeginTransaction();
            context.AddRange(entities);
            try {
                Save();
                DisposeOrCommit(transaction);
            } catch (DbUpdateConcurrencyException) {
                transaction.Dispose();
            }
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

        public IEnumerable<ScheduleReservationGroup> DoCalendarTasks(string fromDate, string toDate, Guid? reservationId) {
            var schedules = this.GetScheduleForPeriod(fromDate, toDate);
            var reservations = this.GetReservationsForPeriod(fromDate, toDate, reservationId);
            return UpdateCalendarData(schedules, reservations);
        }

        public bool DayHasSchedule(string date) {
            var schedule = context.Set<Schedule>()
                .Where(x => x.Date.ToString() == date)
                .ToList();
            return schedule.Count != 0;
        }

        public bool DayHasScheduleForDestination(string date, int destinationId) {
            var schedule = context.Set<Schedule>()
                .Where(x => x.Date.ToString() == date && x.DestinationId == destinationId)
                .ToList();
            return schedule.Count != 0;
        }

        public bool PortHasDepartures(string date, int destinationId, int portId) {
            var schedule = context.Set<Schedule>()
                .Where(x => x.Date.ToString() == date && x.DestinationId == destinationId && x.PortId == portId && x.IsActive)
                .ToList();
            return schedule.Count != 0;
        }

        public int IsValidOnNew(List<ScheduleWriteResource> records) {
            return true switch {
                var x when x == !IsValidDestinationOnNew(records) => 450,
                var x when x == !IsValidPortOnNew(records) => 451,
                _ => 200,
            };
        }

        public int IsValidOnUpdate(ScheduleWriteResource record) {
            return true switch {
                var x when x == !IsValidDestinationOnUpdate(record) => 450,
                var x when x == !IsValidPortOnUpdate(record) => 451,
                _ => 200,
            };
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
                    MaxPassengers = x.MaxPassengers
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
                item.Passengers = (x?.TotalPersons) ?? 0;
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
                        Ports = x.GroupBy(x => new { x.PortId, x.Date, x.DestinationId, x.PortDescription, x.IsPortPrimary, x.MaxPassengers })
                        .Select(x => new PortResource {
                            Id = x.Key.PortId,
                            Description = x.Key.PortDescription,
                            IsPrimary = x.Key.IsPortPrimary,
                            MaxPassengers = x.Key.MaxPassengers,
                            PassengerCount = x.Sum(x => x.Passengers),
                            AvailableSeats = CalculateAvailableSeatsForPort(schedule, x.Key.Date, x.Key.DestinationId, x.Key.MaxPassengers, x.Sum(x => x.Passengers), x.Key.IsPortPrimary)
                        })
                    })
                });
            return response.ToList();
        }

        private static int CalculateAvailableSeatsForAllPorts(IEnumerable<ScheduleResource> schedule, IEnumerable<ReservationResource> reservations, string date, int destinationId) {
            var maxPassengers = CalculateMaxPassengers(schedule, date, destinationId);
            var passengers = CalculatePassengerCountForDestination(reservations, date, destinationId);
            return maxPassengers - passengers;
        }

        private static int CalculateAvailableSeatsForPort(IEnumerable<ScheduleResource> schedule, string date, int destinationId, int maxPassengers, int passengers, bool isPortPrimary) {
            if (isPortPrimary) {
                return CalculateAvailableSeatsForPrimaryPort(schedule, date, destinationId, maxPassengers, passengers);
            } else {
                return CalculateAvailableSeatsForSecondaryPort(schedule, date, destinationId, maxPassengers, passengers);
            }
        }

        private static int CalculatePassengerCountForDestination(IEnumerable<ReservationResource> reservations, string date, int destinationId) {
            return reservations.Where(x => x.Date == date && x.DestinationId == destinationId).Sum(x => x.TotalPersons);
        }

        private static int CalculateMaxPassengers(IEnumerable<ScheduleResource> schedule, string date, int destinationId) {
            return schedule.Where(x => x.Date == date && x.DestinationId == destinationId).Sum(x => x.MaxPassengers);
        }

        private bool IsValidPortOnNew(List<ScheduleWriteResource> records) {
            if (records != null) {
                bool isValid = false;
                foreach (var schedule in records) {
                    isValid = context.Ports.SingleOrDefault(x => x.Id == schedule.PortId && x.IsActive) != null;
                }
                return records.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidPortOnUpdate(ScheduleWriteResource record) {
            return context.Ports.SingleOrDefault(x => x.Id == record.PortId) != null;
        }

        private bool IsValidDestinationOnNew(List<ScheduleWriteResource> records) {
            if (records != null) {
                bool isValid = false;
                foreach (var schedule in records) {
                    isValid = context.Destinations.SingleOrDefault(x => x.Id == schedule.DestinationId && x.IsActive) != null;
                }
                return records.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidDestinationOnUpdate(ScheduleWriteResource record) {
            return context.Destinations.SingleOrDefault(x => x.Id == record.DestinationId) != null;
        }

        private void Save() {
            context.SaveChanges();
        }

        private void DisposeOrCommit(IDbContextTransaction transaction) {
            if (settings.IsTesting) {
                transaction.Dispose();
            } else {
                transaction.Commit();
            }
        }

        private static int CalculateAvailableSeatsForPrimaryPort(IEnumerable<ScheduleResource> schedule, string date, int destinationId, int maxPassengers, int passengers) {
            var secondaryPort = schedule.FirstOrDefault(x => x.Date == date && x.DestinationId == destinationId && !x.IsPortPrimary);
            if (secondaryPort != null && secondaryPort.MaxPassengers != 0) {
                return maxPassengers - passengers;
            } else {
                return maxPassengers - passengers - ((secondaryPort?.Passengers) ?? 0);
            }
        }

        private static int CalculateAvailableSeatsForSecondaryPort(IEnumerable<ScheduleResource> schedule, string date, int destinationId, int maxPassengers, int passengers) {
            var primaryPort = schedule.FirstOrDefault(x => x.Date == date && x.DestinationId == destinationId && x.IsPortPrimary);
            if (primaryPort != null) {
                return primaryPort.MaxPassengers - primaryPort.Passengers + maxPassengers - passengers;
            } else {
                return maxPassengers - passengers;
            }
        }

    }

}