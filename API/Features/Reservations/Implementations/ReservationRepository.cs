using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Features.Drivers;
using API.Features.PickupPoints;
using API.Features.Schedules;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Identity;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Reservations {

    public class ReservationRepository : Repository<Reservation>, IReservationRepository {

        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMapper mapper;
        private readonly TestingEnvironment testingEnvironment;
        private readonly UserManager<UserExtended> userManager;

        public ReservationRepository(AppDbContext appDbContext, IHttpContextAccessor httpContextAccessor, IMapper mapper, IOptions<TestingEnvironment> testingEnvironment, UserManager<UserExtended> userManager) : base(appDbContext, testingEnvironment) {
            this.httpContextAccessor = httpContextAccessor;
            this.mapper = mapper;
            this.testingEnvironment = testingEnvironment.Value;
            this.userManager = userManager;
        }

        public async Task<ReservationGroupVM<ReservationListVM>> GetByDate(string date) {
            IEnumerable<Reservation> reservations = Array.Empty<Reservation>();
            if (await Identity.IsUserAdmin(httpContextAccessor)) {
                reservations = GetReservationsFromAllUsersByDate(date);
            } else {
                var simpleUser = await Identity.GetConnectedUserId(httpContextAccessor);
                var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, simpleUser.UserId);
                reservations = GetReservationsForLinkedCustomer(date, (int)connectedUserDetails.CustomerId);
            }
            var mainResult = new ReservationGroup<Reservation> {
                Persons = reservations.Sum(x => x.TotalPersons),
                Reservations = reservations.ToList(),
            };
            return mapper.Map<ReservationGroup<Reservation>, ReservationGroupVM<ReservationListVM>>(mainResult);
        }

        public async Task<ReservationDriverGroupVM<Reservation>> GetByDateAndDriver(string date, int driverId) {
            var driver = await GetDriver(driverId);
            var reservations = await GetReservationsByDateAndDriver(date, driverId);
            return new ReservationDriverGroupVM<Reservation> {
                Date = date,
                DriverId = driver != null ? driverId : 0,
                DriverDescription = driver != null ? driver.Description : "(EMPTY)",
                Phones = driver != null ? driver.Phones : "(EMPTY)",
                Reservations = mapper.Map<IEnumerable<Reservation>, IEnumerable<ReservationDriverListVM>>(reservations)
            };
        }

        public async Task<ReservationGroupVM<ReservationListVM>> GetByRefNo(string refNo) {
            IEnumerable<Reservation> reservations = Array.Empty<Reservation>();
            var connectedUser = await Identity.GetConnectedUserId(httpContextAccessor);
            if (await Identity.IsUserAdmin(httpContextAccessor)) {
                reservations = GetReservationsFromAllUsersByRefNo(refNo);
            } else {
                var simpleUser = await Identity.GetConnectedUserId(httpContextAccessor);
                var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, simpleUser.UserId);
                reservations = GetReservationsFromLinkedCustomerbyRefNo(refNo, (int)connectedUserDetails.CustomerId);
            }
            var mainResult = new ReservationGroup<Reservation> {
                Persons = reservations.Sum(x => x.TotalPersons),
                Reservations = reservations.ToList(),
            };
            return mapper.Map<ReservationGroup<Reservation>, ReservationGroupVM<ReservationListVM>>(mainResult);
        }

        public async Task<Reservation> GetById(string reservationId) {
            var record = await context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.Ship)
                .Include(x => x.User)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
                .Include(x => x.Passengers).ThenInclude(x => x.Gender)
                .SingleOrDefaultAsync(x => x.ReservationId.ToString() == reservationId);
            return record;
        }

        public async Task<Reservation> GetByIdAsNoTracking(string reservationId) {
            var record = await context.Reservations
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.ReservationId.ToString() == reservationId);
            return record;
        }

        public async Task<Reservation> GetByIdToDelete(string id) {
            return await context.Reservations
                .Include(x => x.Passengers)
                .SingleOrDefaultAsync(x => x.ReservationId.ToString() == id);
        }

        public async Task<bool> IsUserOwner(int customerId) {
            var user = await Identity.GetConnectedUserId(httpContextAccessor);
            var userDetails = Identity.GetConnectedUserDetails(userManager, user.UserId);
            return userDetails.CustomerId == customerId;
        }

        public bool IsKeyUnique(ReservationWriteDto record) {
            return !context.Reservations
                .AsNoTracking()
                .Any(x =>
                    x.Date == Convert.ToDateTime(record.Date) &&
                    x.ReservationId != record.ReservationId &&
                    x.DestinationId == record.DestinationId &&
                    x.CustomerId == record.CustomerId &&
                    string.Equals(x.TicketNo, record.TicketNo, StringComparison.OrdinalIgnoreCase));
        }

        public async Task Update(string id, Reservation updatedRecord) {
            var strategy = context.Database.CreateExecutionStrategy();
            await strategy.Execute(async () => {
                using var transaction = context.Database.BeginTransaction();
                if (await Identity.IsUserAdmin(httpContextAccessor)) {
                    await UpdateReservation(updatedRecord);
                }
                await RemovePassengers(GetPassengersForReservation(id));
                await AddPassengers(updatedRecord);
                if (testingEnvironment.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
            });
        }

        public int GetPortIdFromPickupPointId(ReservationWriteDto record) {
            PickupPoint pickupPoint = context.PickupPoints
                .AsNoTracking()
                .Include(x => x.CoachRoute)
                .SingleOrDefault(x => x.Id == record.PickupPointId);
            return pickupPoint != null ? pickupPoint.CoachRoute.PortId : 0;
        }

        public int IsValid(ReservationWriteDto record, IScheduleRepository scheduleRepo) {
            return true switch {
                var x when x == !IsKeyUnique(record) => 409,
                var x when x == !IsValidCustomer(record) => 450,
                var x when x == !IsValidDestination(record) => 451,
                var x when x == !IsValidPickupPoint(record) => 452,
                var x when x == !IsValidDriver(record) => 453,
                var x when x == !IsValidShip(record) => 454,
                var x when x == !IsValidNationality(record) => 456,
                var x when x == !IsValidGender(record) => 457,
                var x when x == !IsValidOccupant(record) => 458,
                var x when x == !IsCorrectPassengerCount(record) => 455,
                var x when x == !PortHasDepartureForDateAndDestination(scheduleRepo, record) => 410,
                var x when x == !PortHasVacancy(scheduleRepo, record.Date, record.Date, record.ReservationId, record.DestinationId, GetPortIdFromPickupPointId(record), record.Adults + record.Kids + record.Free) => 433,
                var x when x == !IsOverbookingAllowed(record.Date, record.ReservationId, record.DestinationId, record.Adults + record.Kids + record.Free) => 433,
                var x when x == SimpleUserHasNightRestrictions(record) => 459,
                var x when x == SimpleUserCanNotAddReservationAfterDeparture(record) => 431,
                _ => 200,
            };
        }

        public void AssignToDriver(int driverId, string[] ids) {
            var strategy = context.Database.CreateExecutionStrategy();
            strategy.Execute(() => {
                using var transaction = context.Database.BeginTransaction();
                var records = context.Reservations
                    .Where(x => ids.Contains(x.ReservationId.ToString()))
                    .ToList();
                records.ForEach(a => a.DriverId = driverId);
                context.SaveChanges();
                if (testingEnvironment.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
            });
        }

        public void AssignToShip(int shipId, string[] ids) {
            var strategy = context.Database.CreateExecutionStrategy();
            strategy.Execute(() => {
                using var transaction = context.Database.BeginTransaction();
                var records = context.Reservations
                    .Where(x => ids.Contains(x.ReservationId.ToString()))
                    .ToList();
                records.ForEach(a => a.ShipId = shipId);
                context.SaveChanges();
                if (testingEnvironment.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
            });
        }

        public async Task<string> AssignRefNoToNewReservation(ReservationWriteDto record) {
            return await GetDestinationAbbreviation(record) + await IncrementRefNoByOne();
        }

        public bool IsOverbooked(string date, int destinationId) {
            int maxPassengersForAllPorts = context.Schedules
                .AsNoTracking()
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId)
                .Sum(x => x.MaxPassengers);
            int totalPersonsFromAllPorts = context.Reservations
                .AsNoTracking()
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId)
                .Sum(x => x.TotalPersons);
            return totalPersonsFromAllPorts > maxPassengersForAllPorts;
        }

        private IEnumerable<Passenger> GetPassengersForReservation(string id) {
            return context.Passengers
                .AsNoTracking()
                .Where(x => x.ReservationId.ToString() == id)
                .ToList();
        }

        private async Task UpdateReservation(Reservation updatedRecord) {
            context.Entry(updatedRecord).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        private async Task AddPassengers(Reservation updatedRecord) {
            var records = new List<Passenger>();
            records.AddRange(updatedRecord.Passengers);
            context.Passengers.AddRange(records);
            await context.SaveChangesAsync();
        }

        private async Task RemovePassengers(IEnumerable<Passenger> passengers) {
            context.Passengers.RemoveRange(passengers);
            await context.SaveChangesAsync();
        }

        private bool PortHasDepartureForDateAndDestination(IScheduleRepository scheduleRepo, ReservationWriteDto record) {
            return scheduleRepo.PortHasDepartureForDateAndDestination(record.Date, record.DestinationId, GetPortIdFromPickupPointId(record));
        }

        private bool PortHasVacancy(IScheduleRepository scheduleRepo, string fromDate, string toDate, Guid? reservationId, int destinationId, int portId, int reservationPersons) {
            if (Identity.IsUserAdmin(httpContextAccessor).Result || reservationId != null) {
                return true;
            } else {
                int maxPassengers = GetPortMaxPassengers(scheduleRepo, fromDate, toDate, reservationId, destinationId, portId);
                return maxPassengers >= reservationPersons;
            }
        }

        private bool IsOverbookingAllowed(string date, Guid? reservationId, int destinationId, int totalPersons) {
            if (Identity.IsUserAdmin(httpContextAccessor).Result || reservationId != null) {
                return true;
            } else {
                int maxPassengersForAllPorts = context.Schedules
                    .AsNoTracking()
                    .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId)
                    .Sum(x => x.MaxPassengers);
                int totalPersonsFromAllPorts = context.Reservations
                    .AsNoTracking()
                    .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId && x.ReservationId != reservationId)
                    .Sum(x => x.TotalPersons);
                return totalPersonsFromAllPorts + totalPersons <= maxPassengersForAllPorts;
            }
        }

        private static int GetPortMaxPassengers(IScheduleRepository scheduleRepo, string fromDate, string toDate, Guid? reservationId, int destinationId, int portId) {
            IEnumerable<ScheduleReservationGroup> schedule = scheduleRepo.DoCalendarTasks(fromDate, toDate, reservationId).ToList();
            var port = schedule.Select(x => x.Destinations.SingleOrDefault(x => x.Id == destinationId).Ports.SingleOrDefault(x => x.Id == portId)).Select(x => new {
                MaxPassengers = x.AvailableSeats
            }).ToList();
            return port[0].MaxPassengers;
        }

        private bool SimpleUserCanNotAddReservationAfterDeparture(ReservationWriteDto record) {
            return !Identity.IsUserAdmin(httpContextAccessor).Result && IsAfterDeparture(record);
        }

        private bool IsValidCustomer(ReservationWriteDto record) {
            if (record.ReservationId == null) {
                return context.Customers.AsNoTracking().SingleOrDefault(x => x.Id == record.CustomerId && x.IsActive) != null;
            }
            return context.Customers.AsNoTracking().SingleOrDefault(x => x.Id == record.CustomerId) != null;
        }

        private bool IsValidDestination(ReservationWriteDto record) {
            if (record.ReservationId == null) {
                return context.Destinations.AsNoTracking().SingleOrDefault(x => x.Id == record.DestinationId && x.IsActive) != null;
            }
            return context.Destinations.AsNoTracking().SingleOrDefault(x => x.Id == record.DestinationId) != null;
        }

        private bool IsValidPickupPoint(ReservationWriteDto record) {
            if (record.ReservationId == null) {
                return context.PickupPoints.AsNoTracking().SingleOrDefault(x => x.Id == record.PickupPointId && x.IsActive) != null;
            }
            return context.PickupPoints.AsNoTracking().SingleOrDefault(x => x.Id == record.PickupPointId) != null;
        }

        private bool IsValidDriver(ReservationWriteDto record) {
            if (record.DriverId != null && record.DriverId != 0) {
                if (record.ReservationId == null) {
                    var driver = context.Drivers.AsNoTracking().SingleOrDefault(x => x.Id == record.DriverId && x.IsActive);
                    if (driver == null)
                        return false;
                } else {
                    var driver = context.Drivers.AsNoTracking().SingleOrDefault(x => x.Id == record.DriverId);
                    if (driver == null)
                        return false;
                }
            }
            return true;
        }

        private bool IsValidShip(ReservationWriteDto record) {
            if (record.ShipId != null && record.ShipId != 0) {
                if (record.ReservationId == null) {
                    var ship = context.Ships.AsNoTracking().SingleOrDefault(x => x.Id == record.ShipId && x.IsActive);
                    if (ship == null)
                        return false;
                } else {
                    var ship = context.Ships.AsNoTracking().SingleOrDefault(x => x.Id == record.ShipId);
                    if (ship == null)
                        return false;
                }
            }
            return true;
        }

        private static bool IsCorrectPassengerCount(ReservationWriteDto record) {
            if (record.Passengers != null) {
                if (record.Passengers.Count != 0) {
                    return record.Passengers.Count <= record.Adults + record.Kids + record.Free;
                }
            }
            return true;
        }

        private bool IsValidNationality(ReservationWriteDto record) {
            if (record.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in record.Passengers) {
                    if (record.ReservationId == null) {
                        isValid = context.Nationalities.AsNoTracking().SingleOrDefault(x => x.Id == passenger.NationalityId && x.IsActive) != null;
                    } else {
                        isValid = context.Nationalities.AsNoTracking().SingleOrDefault(x => x.Id == passenger.NationalityId) != null;
                    }
                }
                return record.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidGender(ReservationWriteDto record) {
            if (record.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in record.Passengers) {
                    if (record.ReservationId == null) {
                        isValid = context.Genders.AsNoTracking().SingleOrDefault(x => x.Id == passenger.GenderId && x.IsActive) != null;
                    } else {
                        isValid = context.Genders.AsNoTracking().SingleOrDefault(x => x.Id == passenger.GenderId) != null;
                    }
                }
                return record.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidOccupant(ReservationWriteDto record) {
            if (record.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in record.Passengers) {
                    if (record.ReservationId == null) {
                        isValid = context.Occupants.AsNoTracking().SingleOrDefault(x => x.Id == passenger.OccupantId && x.IsActive) != null;
                    } else {
                        isValid = context.Occupants.AsNoTracking().SingleOrDefault(x => x.Id == passenger.OccupantId) != null;
                    }
                }
                return record.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private IEnumerable<Reservation> GetReservationsFromAllUsersByDate(string date) {
            return context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.Date == Convert.ToDateTime(date));
        }

        private IEnumerable<Reservation> GetReservationsForLinkedCustomer(string date, int customerId) {
            var reservations = context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.Date == Convert.ToDateTime(date) && x.CustomerId == customerId);
            return reservations;
        }

        private IEnumerable<Reservation> GetReservationsFromAllUsersByRefNo(string refNo) {
            return context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.RefNo == refNo);
        }

        private IEnumerable<Reservation> GetReservationsFromLinkedCustomerbyRefNo(string refNo, int customerId) {
            return context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.RefNo == refNo && x.CustomerId == customerId);
        }

        private async Task<IEnumerable<Reservation>> GetReservationsByDateAndDriver(string date, int driverId) {
            return await context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint)
                .Include(x => x.Passengers)
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DriverId == (driverId != 0 ? driverId : null))
                .OrderBy(x => x.PickupPoint.Time).ThenBy(x => x.PickupPoint.Description)
                .ToListAsync();
        }

        private async Task<string> IncrementRefNoByOne() {
            var refNo = context.RefNos.First();
            refNo.LastRefNo++;
            context.Entry(refNo).State = EntityState.Modified;
            var strategy = context.Database.CreateExecutionStrategy();
            await strategy.Execute(async () => {
                using var transaction = context.Database.BeginTransaction();
                await context.SaveChangesAsync();
                transaction.Commit();
            });
            return refNo.LastRefNo.ToString();
        }

        private async Task<string> GetDestinationAbbreviation(ReservationWriteDto record) {
            var destination = await context.Destinations
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == record.DestinationId);
            return destination.Abbreviation;
        }

        private async Task<Driver> GetDriver(int driverId) {
            return await context.Drivers
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == driverId);
        }

        private bool SimpleUserHasNightRestrictions(ReservationWriteDto record) {
            if (!Identity.IsUserAdmin(httpContextAccessor).Result && record.ReservationId == null) {
                if (HasTransfer(record.PickupPointId)) {
                    if (IsForTomorrow(record)) {
                        if (IsBetweenClosingTimeAndMidnight(record)) {
                            return true;
                        }
                    }
                    if (IsForToday(record)) {
                        if (IsBetweenMidnightAndDeparture(record)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        private bool HasTransfer(int pickupPointId) {
            var pickupPoint = context.PickupPoints
                .AsNoTracking()
                .Include(x => x.CoachRoute)
                .AsNoTracking()
                .SingleOrDefault(x => x.Id == pickupPointId);
            return pickupPoint.CoachRoute.HasTransfer;
        }

        private bool IsForTomorrow(ReservationWriteDto record) {
            var tomorrow = testingEnvironment.IsTesting ? record.TestDateNow.AddDays(1) : DateHelpers.GetLocalDateTime().AddDays(1);
            var tomorrowDate = DateHelpers.DateTimeToISOString(tomorrow);
            return record.Date == tomorrowDate;
        }

        private bool IsForToday(ReservationWriteDto record) {
            var today = testingEnvironment.IsTesting ? record.TestDateNow : DateHelpers.GetLocalDateTime();
            var todayDate = DateHelpers.DateTimeToISOString(today);
            return record.Date == todayDate;
        }

        private bool IsBetweenClosingTimeAndMidnight(ReservationWriteDto record) {
            var timeNow = testingEnvironment.IsTesting ? record.TestDateNow.TimeOfDay : DateHelpers.GetLocalDateTime().TimeOfDay;
            return timeNow.Hours >= 22;
        }

        private bool IsBetweenMidnightAndDeparture(ReservationWriteDto record) {
            var timeNow = DateHelpers.GetLocalDateTime();
            var departureTime = GetScheduleDepartureTime(record);
            return DateTime.Compare(timeNow, departureTime) < 0;
        }

        private bool IsAfterDeparture(ReservationWriteDto record) {
            var now = testingEnvironment.IsTesting ? record.TestDateNow : DateHelpers.GetLocalDateTime();
            var departure = GetScheduleDepartureTime(record);
            return DateTime.Compare(now, departure) > 0;
        }

        private DateTime GetScheduleDepartureTime(ReservationWriteDto record) {
            var portId = GetPortIdFromPickupPointId(record).ToString();
            var schedule = context.Schedules
                .AsNoTracking()
                .Where(x => x.Date.ToString() == record.Date && x.DestinationId == record.DestinationId && x.PortId.ToString() == portId)
                .SingleOrDefault();
            var departureTime = schedule.Date.ToString("yyyy-MM-dd") + " " + schedule.DepartureTime;
            var departureTimeAsDate = DateTime.Parse(departureTime);
            return departureTimeAsDate;
        }

    }

}