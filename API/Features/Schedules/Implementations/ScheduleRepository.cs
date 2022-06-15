using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Exceptions;
using API.Infrastructure.Implementations;
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

        public async Task<IEnumerable<ScheduleListViewModel>> GetForList() {
            var schedules = await context.Set<Schedule>()
                .Include(x => x.Destination)
                .Include(x => x.Port)
                .OrderBy(x => x.Date).ThenBy(x => x.Destination.Description).ThenBy(x => x.Port.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Schedule>, IEnumerable<ScheduleListViewModel>>(schedules);
        }

        new public async Task<ScheduleReadDto> GetById(int scheduleId) {
            var record = await context.Set<Schedule>()
                .Include(p => p.Port)
                .Include(p => p.Destination)
                .SingleOrDefaultAsync(m => m.Id == scheduleId);
            if (record != null) {
                return mapper.Map<Schedule, ScheduleReadDto>(record);
            } else {
                throw new CustomException { HttpResponseCode = 404 };
            }
        }

        public async Task<Schedule> GetByIdToDelete(int id) {
            return await context.Set<Schedule>().FirstAsync(x => x.Id == id);
        }

        public void Create(List<Schedule> entities) {
            var strategy = context.Database.CreateExecutionStrategy();
            strategy.Execute(() => {
                using var transaction = context.Database.BeginTransaction();
                context.AddRange(entities);
                Save();
                DisposeOrCommit(transaction);
            });
        }

        public void DeleteRange(List<ScheduleDeleteRangeDto> schedules) {
            var objectsToDelete = new List<Schedule>();
            foreach (var item in schedules) {
                var objectToDelete = context.Schedules
                    .Where(x => x.Date == Convert.ToDateTime(item.Date) && x.DestinationId == item.DestinationId && x.PortId == item.PortId)
                    .FirstOrDefault();
                if (objectToDelete != null) {
                    objectsToDelete.Add(objectToDelete);
                }
            }
            if (objectsToDelete.Count > 0) {
                context.RemoveRange(objectsToDelete);
                context.SaveChanges();
            }
        }

        public IEnumerable<ScheduleReservationGroup> DoCalendarTasks(string fromDate, string toDate, Guid? reservationId) {
            var schedules = GetScheduleForPeriod(fromDate, toDate);
            var reservations = GetReservationsForPeriod(fromDate, toDate, reservationId);
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

        public int IsValidOnNew(List<ScheduleWriteDto> records) {
            return true switch {
                var x when x == !IsValidDestinationOnNew(records) => 450,
                var x when x == !IsValidPortOnNew(records) => 451,
                _ => 200,
            };
        }

        public int IsValidOnUpdate(ScheduleWriteDto record) {
            return true switch {
                var x when x == !IsValidDestinationOnUpdate(record) => 450,
                var x when x == !IsValidPortOnUpdate(record) => 451,
                _ => 200,
            };
        }

        private IEnumerable<ScheduleViewModel> GetScheduleForPeriod(string fromDate, string toDate) {
            var response = context.Set<Schedule>()
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate) && x.IsActive && x.Destination.IsActive)
                .OrderBy(x => x.Date).ThenBy(x => x.DestinationId).ThenBy(x => x.PortId)
                .Select(x => new ScheduleViewModel {
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

        private IEnumerable<ReservationViewModel> GetReservationsForPeriod(string fromDate, string toDate, Guid? reservationId) {
            var response = context.Set<Reservation>()
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate) && x.ReservationId != reservationId)
                .OrderBy(x => x.Date).ThenBy(x => x.DestinationId).ThenBy(x => x.PortId)
                .GroupBy(x => new { x.Date, x.DestinationId, x.PortId })
                .Select(x => new ReservationViewModel {
                    Date = x.Key.Date.ToString(),
                    DestinationId = x.Key.DestinationId,
                    PortId = x.Key.PortId,
                    TotalPersons = x.Sum(x => x.TotalPersons)
                });
            return response.ToList();
        }

        private static IEnumerable<ScheduleReservationGroup> UpdateCalendarData(IEnumerable<ScheduleViewModel> schedule, IEnumerable<ReservationViewModel> reservations) {
            foreach (var item in schedule) {
                var x = reservations.FirstOrDefault(x => x.Date == item.Date && x.DestinationId == item.DestinationId && x.PortId == item.PortId);
                item.Passengers = (x?.TotalPersons) ?? 0;
            }
            var response = schedule
                .GroupBy(x => x.Date)
                .Select(x => new ScheduleReservationGroup {
                    Date = x.Key,
                    Destinations = x.GroupBy(x => new { x.Date, x.DestinationId, x.DestinationDescription })
                    .Select(x => new DestinationPortsViewModel {
                        Id = x.Key.DestinationId,
                        Description = x.Key.DestinationDescription,
                        PassengerCount = CalculatePassengerCountForDestination(reservations, x.Key.Date, x.Key.DestinationId),
                        AvailableSeats = CalculateAvailableSeatsForAllPorts(schedule, reservations, x.Key.Date, x.Key.DestinationId),
                        Ports = x.GroupBy(x => new { x.PortId, x.Date, x.DestinationId, x.PortDescription, x.IsPortPrimary, x.MaxPassengers })
                        .Select(x => new PortViewModel {
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

        private static int CalculateAvailableSeatsForAllPorts(IEnumerable<ScheduleViewModel> schedule, IEnumerable<ReservationViewModel> reservations, string date, int destinationId) {
            var maxPassengers = CalculateMaxPassengers(schedule, date, destinationId);
            var passengers = CalculatePassengerCountForDestination(reservations, date, destinationId);
            return maxPassengers - passengers;
        }

        private static int CalculateAvailableSeatsForPort(IEnumerable<ScheduleViewModel> schedule, string date, int destinationId, int maxPassengers, int passengers, bool isPortPrimary) {
            if (isPortPrimary) {
                return CalculateAvailableSeatsForPrimaryPort(schedule, date, destinationId, maxPassengers, passengers);
            } else {
                return CalculateAvailableSeatsForSecondaryPort(schedule, date, destinationId, maxPassengers, passengers);
            }
        }

        private static int CalculatePassengerCountForDestination(IEnumerable<ReservationViewModel> reservations, string date, int destinationId) {
            return reservations.Where(x => x.Date == date && x.DestinationId == destinationId).Sum(x => x.TotalPersons);
        }

        private static int CalculateMaxPassengers(IEnumerable<ScheduleViewModel> schedule, string date, int destinationId) {
            return schedule.Where(x => x.Date == date && x.DestinationId == destinationId).Sum(x => x.MaxPassengers);
        }

        private bool IsValidPortOnNew(List<ScheduleWriteDto> records) {
            if (records != null) {
                bool isValid = false;
                foreach (var schedule in records) {
                    isValid = context.Ports.SingleOrDefault(x => x.Id == schedule.PortId && x.IsActive) != null;
                }
                return records.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidPortOnUpdate(ScheduleWriteDto record) {
            return context.Ports.SingleOrDefault(x => x.Id == record.PortId) != null;
        }

        private bool IsValidDestinationOnNew(List<ScheduleWriteDto> records) {
            if (records != null) {
                bool isValid = false;
                foreach (var schedule in records) {
                    isValid = context.Destinations.SingleOrDefault(x => x.Id == schedule.DestinationId && x.IsActive) != null;
                }
                return records.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidDestinationOnUpdate(ScheduleWriteDto record) {
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

        private static int CalculateAvailableSeatsForPrimaryPort(IEnumerable<ScheduleViewModel> schedule, string date, int destinationId, int maxPassengers, int passengers) {
            var secondaryPort = schedule.FirstOrDefault(x => x.Date == date && x.DestinationId == destinationId && !x.IsPortPrimary);
            if (secondaryPort != null && secondaryPort.MaxPassengers != 0) {
                return maxPassengers - passengers;
            } else {
                return maxPassengers - passengers - ((secondaryPort?.Passengers) ?? 0);
            }
        }

        private static int CalculateAvailableSeatsForSecondaryPort(IEnumerable<ScheduleViewModel> schedule, string date, int destinationId, int maxPassengers, int passengers) {
            var primaryPort = schedule.FirstOrDefault(x => x.Date == date && x.DestinationId == destinationId && x.IsPortPrimary);
            if (primaryPort != null) {
                return primaryPort.MaxPassengers - primaryPort.Passengers + maxPassengers - passengers;
            } else {
                return maxPassengers - passengers;
            }
        }

    }

}