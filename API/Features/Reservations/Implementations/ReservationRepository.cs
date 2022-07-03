using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Features.Drivers;
using API.Features.Invoicing;
using API.Features.PickupPoints;
using API.Features.Schedules;
using API.Infrastructure.Classes;
using API.Infrastructure.Exceptions;
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
        private readonly TestingEnvironment settings;
        private readonly UserManager<UserExtended> userManager;

        public ReservationRepository(AppDbContext appDbContext, IHttpContextAccessor httpContextAccessor, IMapper mapper, IOptions<TestingEnvironment> settings, UserManager<UserExtended> userManager) : base(appDbContext, settings) {
            this.httpContextAccessor = httpContextAccessor;
            this.mapper = mapper;
            this.settings = settings.Value;
            this.userManager = userManager;
        }

        public async Task<ReservationGroupResource<ReservationListResource>> GetByDate(string date) {
            IEnumerable<Reservation> reservations = Array.Empty<Reservation>();
            if (await Identity.IsUserAdmin(httpContextAccessor)) {
                reservations = GetReservationsFromAllUsersByDate(date);
            } else {
                var simpleUser = await Identity.GetConnectedUserId(httpContextAccessor);
                var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, simpleUser.UserId);
                reservations = GetReservationsForLinkedCustomer(date, (int)connectedUserDetails.CustomerId);
            }
            var mainResult = new MainResult<Reservation> {
                Persons = reservations.Sum(x => x.TotalPersons),
                Reservations = reservations.ToList(),
            };
            return mapper.Map<MainResult<Reservation>, ReservationGroupResource<ReservationListResource>>(mainResult);
        }

        public async Task<DriverResult<Reservation>> GetByDateAndDriver(string date, int driverId) {
            var driver = await GetDriver(driverId);
            var reservations = await GetReservationsByDateAndDriver(date, driverId);
            return new DriverResult<Reservation> {
                Date = date,
                DriverId = driver != null ? driverId : 0,
                DriverDescription = driver != null ? driver.Description : "(EMPTY)",
                Phones = driver != null ? driver.Phones : "(EMPTY)",
                Reservations = mapper.Map<IEnumerable<Reservation>, IEnumerable<ReservationDriverListResource>>(reservations)
            };
        }

        public async Task<ReservationGroupResource<ReservationListResource>> GetByRefNo(string refNo) {
            IEnumerable<Reservation> reservations;
            var connectedUser = await Identity.GetConnectedUserId(httpContextAccessor);
            if (await Identity.IsUserAdmin(httpContextAccessor)) {
                reservations = GetReservationsFromAllUsersByRefNo(refNo);
            } else {
                var simpleUser = await Identity.GetConnectedUserId(httpContextAccessor);
                var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, simpleUser.UserId);
                reservations = GetReservationsFromLinkedCustomerbyRefNo(refNo, (int)connectedUserDetails.CustomerId);
            }
            var mainResult = new MainResult<Reservation> {
                Persons = reservations.Sum(x => x.TotalPersons),
                Reservations = reservations.ToList(),
            };
            return mapper.Map<MainResult<Reservation>, ReservationGroupResource<ReservationListResource>>(mainResult);
        }

        public async Task<ReservationReadResource> GetById(string reservationId) {
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
            return record != null
                ? mapper.Map<Reservation, ReservationReadResource>(record)
                : throw new CustomException { HttpResponseCode = 404 };
        }

        public async Task<Reservation> GetByIdToDelete(string id) {
            return await context.Reservations
                .Include(x => x.Passengers)
                .FirstAsync(x => x.ReservationId.ToString() == id);
        }

        public async Task<bool> DoesUserOwnRecord(int customerId) {
            var user = await Identity.GetConnectedUserId(httpContextAccessor);
            var userDetails = Identity.GetConnectedUserDetails(userManager, user.UserId);
            return userDetails.CustomerId == customerId;
        }

        public bool IsKeyUnique(ReservationWriteResource record) {
            return !context.Reservations.Any(x =>
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
                if (settings.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
            });
        }

        public int GetPortIdFromPickupPointId(ReservationWriteResource record) {
            PickupPoint pickupPoint = context.PickupPoints
                .Include(x => x.CoachRoute)
                .Where(x => x.Id == record.PickupPointId)
                .FirstOrDefault();
            return pickupPoint.CoachRoute.PortId;
        }

        public int IsValid(ReservationWriteResource record, IScheduleRepository scheduleRepo) {
            return true switch {
                var x when x == !IsValidCustomer(record) => 450,
                var x when x == !IsValidDestination(record) => 451,
                var x when x == !IsValidPickupPoint(record) => 452,
                var x when x == !IsValidDriver(record) => 453,
                var x when x == !IsValidShip(record) => 454,
                var x when x == !IsValidNationality(record) => 456,
                var x when x == !IsValidGender(record) => 457,
                var x when x == !IsValidOccupant(record) => 458,
                var x when x == !IsCorrectPassengerCount(record) => 455,
                var x when x == !scheduleRepo.DayHasSchedule(record.Date) => 432,
                var x when x == !scheduleRepo.DayHasScheduleForDestination(record.Date, record.DestinationId) => 430,
                var x when x == !scheduleRepo.PortHasDepartures(record.Date, record.DestinationId, GetPortIdFromPickupPointId(record)) => 427,
                var x when x == SimpleUserHasNightRestrictions(record) => 459,
                var x when x == SimpleUserCanNotAddReservationAfterDeparture(record) => 431,
                var x when x == !PortHasVacancy(scheduleRepo, record.Date, record.Date, record.ReservationId, record.DestinationId, GetPortIdFromPickupPointId(record), record.Adults + record.Kids + record.Free) => 433,
                var x when x == !IsOverbookingAllowed(record.Date, record.ReservationId, record.DestinationId, record.Adults + record.Kids + record.Free) => 433,
                var x when x == !IsKeyUnique(record) => 409,
                _ => 200,
            };
        }

        public void AssignToDriver(int driverId, string[] id) {
            var strategy = context.Database.CreateExecutionStrategy();
            strategy.Execute(() => {
                using var transaction = context.Database.BeginTransaction();
                var reservations = context.Reservations
                    .Where(x => id.Contains(x.ReservationId.ToString()))
                    .ToList();
                reservations.ForEach(a => a.DriverId = driverId);
                context.SaveChanges();
                if (settings.IsTesting) {
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
                if (settings.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
            });
        }

        public ReservationWriteResource UpdateForeignKeysWithNull(ReservationWriteResource reservation) {
            if (reservation.DriverId == 0) reservation.DriverId = null;
            if (reservation.ShipId == 0) reservation.ShipId = null;
            return reservation;
        }

        public async Task<string> AssignRefNoToNewReservation(ReservationWriteResource record) {
            return await GetDestinationAbbreviation(record) + await IncrementRefNoByOne();
        }

        private IEnumerable<Passenger> GetPassengersForReservation(string id) {
            return context.Set<Passenger>()
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
            context.Set<Passenger>().AddRange(records);
            await context.SaveChangesAsync();
        }

        private async Task RemovePassengers(IEnumerable<Passenger> passengers) {
            context.Set<Passenger>().RemoveRange(passengers);
            await context.SaveChangesAsync();
        }

        private bool PortHasVacancy(IScheduleRepository scheduleRepo, string fromDate, string toDate, Guid? reservationId, int destinationId, int portId, int reservationPersons) {
            if (Identity.IsUserAdmin(httpContextAccessor).Result) {
                return true;
            } else {
                int maxPassengers = GetPortMaxPassengers(scheduleRepo, fromDate, toDate, reservationId, destinationId, portId);
                return maxPassengers >= reservationPersons;
            }
        }

        private bool IsOverbookingAllowed(string date, Guid? reservationId, int destinationId, int totalPersons) {
            if (Identity.IsUserAdmin(httpContextAccessor).Result) {
                return true;
            } else {
                int maxPassengersForAllPorts = context.Schedules
                    .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId)
                    .Sum(x => x.MaxPassengers);
                int totalPersonsFromAllPorts = context.Reservations
                    .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId && x.ReservationId != reservationId)
                    .Sum(x => x.TotalPersons);
                return totalPersonsFromAllPorts + totalPersons <= maxPassengersForAllPorts;
            }
        }

        public bool IsOverbooked(string date, int destinationId) {
            int maxPassengersForAllPorts = context.Schedules
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId)
                .Sum(x => x.MaxPassengers);
            int totalPersonsFromAllPorts = context.Reservations
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId)
                .Sum(x => x.TotalPersons);
            return totalPersonsFromAllPorts > maxPassengersForAllPorts;
        }

        private static int GetPortMaxPassengers(IScheduleRepository scheduleRepo, string fromDate, string toDate, Guid? reservationId, int destinationId, int portId) {
            IEnumerable<ScheduleReservationGroup> schedule = scheduleRepo.DoCalendarTasks(fromDate, toDate, reservationId).ToList();
            var port = schedule.Select(x => x.Destinations.SingleOrDefault(x => x.Id == destinationId).Ports.SingleOrDefault(x => x.Id == portId)).Select(x => new {
                MaxPassengers = x.AvailableSeats
            }).ToList();
            return port[0].MaxPassengers;
        }

        private bool SimpleUserCanNotAddReservationAfterDeparture(ReservationWriteResource record) {
            return !Identity.IsUserAdmin(httpContextAccessor).Result && IsNewReservationAfterDeparture(record);
        }

        private bool IsValidCustomer(ReservationWriteResource record) {
            if (record.ReservationId == null) {
                return context.Customers.SingleOrDefault(x => x.Id == record.CustomerId && x.IsActive) != null;
            }
            return context.Customers.SingleOrDefault(x => x.Id == record.CustomerId) != null;
        }

        private bool IsValidDestination(ReservationWriteResource record) {
            if (record.ReservationId == null) {
                return context.Destinations.SingleOrDefault(x => x.Id == record.DestinationId && x.IsActive) != null;
            }
            return context.Destinations.SingleOrDefault(x => x.Id == record.DestinationId) != null;
        }

        private bool IsValidPickupPoint(ReservationWriteResource record) {
            if (record.ReservationId == null) {
                return context.PickupPoints.SingleOrDefault(x => x.Id == record.PickupPointId && x.IsActive) != null;
            }
            return context.PickupPoints.SingleOrDefault(x => x.Id == record.PickupPointId) != null;
        }

        private bool IsValidDriver(ReservationWriteResource record) {
            if (record.DriverId != null && record.DriverId != 0) {
                if (record.ReservationId == null) {
                    var driver = context.Drivers.SingleOrDefault(x => x.Id == record.DriverId && x.IsActive);
                    if (driver == null)
                        return false;
                } else {
                    var driver = context.Drivers.SingleOrDefault(x => x.Id == record.DriverId);
                    if (driver == null)
                        return false;
                }
            }
            return true;
        }

        private bool IsValidShip(ReservationWriteResource record) {
            if (record.ShipId != null && record.ShipId != 0) {
                if (record.ReservationId == null) {
                    var ship = context.Ships.SingleOrDefault(x => x.Id == record.ShipId && x.IsActive);
                    if (ship == null)
                        return false;
                } else {
                    var ship = context.Ships.SingleOrDefault(x => x.Id == record.ShipId);
                    if (ship == null)
                        return false;
                }
            }
            return true;
        }

        private static bool IsCorrectPassengerCount(ReservationWriteResource record) {
            if (record.Passengers != null) {
                if (record.Passengers.Count != 0) {
                    return record.Passengers.Count <= record.Adults + record.Kids + record.Free;
                }
            }
            return true;
        }

        private bool IsValidNationality(ReservationWriteResource record) {
            if (record.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in record.Passengers) {
                    if (record.ReservationId == null) {
                        isValid = context.Nationalities.SingleOrDefault(x => x.Id == passenger.NationalityId && x.IsActive) != null;
                    } else {
                        isValid = context.Nationalities.SingleOrDefault(x => x.Id == passenger.NationalityId) != null;
                    }
                }
                return record.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidGender(ReservationWriteResource record) {
            if (record.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in record.Passengers) {
                    if (record.ReservationId == null) {
                        isValid = context.Genders.SingleOrDefault(x => x.Id == passenger.GenderId && x.IsActive) != null;
                    } else {
                        isValid = context.Genders.SingleOrDefault(x => x.Id == passenger.GenderId) != null;
                    }
                }
                return record.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidOccupant(ReservationWriteResource record) {
            if (record.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in record.Passengers) {
                    if (record.ReservationId == null) {
                        isValid = context.Occupants.SingleOrDefault(x => x.Id == passenger.OccupantId && x.IsActive) != null;
                    } else {
                        isValid = context.Occupants.SingleOrDefault(x => x.Id == passenger.OccupantId) != null;
                    }
                }
                return record.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private IEnumerable<Reservation> GetReservationsFromAllUsersByDate(string date) {
            return context.Reservations
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
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.RefNo == refNo);
        }

        private IEnumerable<Reservation> GetReservationsFromLinkedCustomerbyRefNo(string refNo, int customerId) {
            return context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.RefNo == refNo && x.CustomerId == customerId);
        }

        private async Task<IEnumerable<Reservation>> GetReservationsByDateAndDriver(string date, int driverId) {
            return await context.Reservations
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

        private async Task<string> GetDestinationAbbreviation(ReservationWriteResource record) {
            var destination = await context.Destinations
                .FirstOrDefaultAsync(x => x.Id == record.DestinationId);
            return destination.Abbreviation;
        }

        private async Task<Driver> GetDriver(int driverId) {
            return await context.Drivers
                .FirstOrDefaultAsync(x => x.Id == driverId);
        }

        private bool SimpleUserHasNightRestrictions(ReservationWriteResource record) {
            if (!Identity.IsUserAdmin(httpContextAccessor).Result && record.ReservationId == null) {
                if (HasTransfer(record.PickupPointId)) {
                    if (IsReservationForTomorrow(record.Date)) {
                        if (IsNight()) {
                            return true;
                        }
                    }
                    if (IsReservationForToday(record.Date)) {
                        if (IsNewReservationBeforeDeparture(record)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        private bool HasTransfer(int pickupPointId) {
            var pickupPoint = context.PickupPoints
                .Include(x => x.CoachRoute)
                .AsNoTracking()
                .SingleOrDefault(x => x.Id == pickupPointId);
            return pickupPoint.CoachRoute.HasTransfer;
        }

        private static bool IsReservationForTomorrow(string date) {
            var tomorrow = DateHelpers.GetLocalDateTime().AddDays(1);
            var tomorrowDate = DateHelpers.DateTimeToISOString(tomorrow);
            return date == tomorrowDate;
        }

        private static bool IsReservationForToday(string date) {
            var today = DateHelpers.GetLocalDateTime();
            var todayDate = DateHelpers.DateTimeToISOString(today);
            return date == todayDate;
        }

        private static bool IsNight() {
            var timeNow = DateHelpers.GetLocalDateTime().TimeOfDay;
            return timeNow.Hours >= 22;
        }

        private bool IsNewReservationBeforeDeparture(ReservationWriteResource record) {
            var timeNow = DateHelpers.GetLocalDateTime();
            var departureTime = GetScheduleDepartureTime(record);
            return DateTime.Compare(timeNow, departureTime) < 0;
        }

        private bool IsNewReservationAfterDeparture(ReservationWriteResource record) {
            var date = DateHelpers.GetLocalDateTime();
            var departureTime = GetScheduleDepartureTime(record);
            return DateTime.Compare(date, departureTime) > 0;
        }

        private DateTime GetScheduleDepartureTime(ReservationWriteResource record) {
            var portId = GetPortIdFromPickupPointId(record).ToString();
            var schedule = context.Set<Schedule>()
                .Where(x => x.Date.ToString() == record.Date && x.DestinationId == record.DestinationId && x.PortId.ToString() == portId)
                .SingleOrDefault();
            var departureTime = schedule.Date.ToString("yyyy-MM-dd") + " " + schedule.DepartureTime;
            var departureTimeAsDate = DateTime.Parse(departureTime);
            return departureTimeAsDate;
        }

        public async Task<IEnumerable<InvoicingReportVM>> GetSimpleUserInvoicing(string fromDate, string toDate) {
            var simpleUser = await Identity.GetConnectedUserId(httpContextAccessor);
            var userDetails = Identity.GetConnectedUserDetails(userManager, simpleUser.UserId);
            var records = context.Set<Reservation>()
                 .Include(x => x.Customer)
                 .Include(x => x.Destination)
                 .Include(x => x.PickupPoint).ThenInclude(x => x.CoachRoute)
                 .Include(x => x.Port)
                 .Include(x => x.Ship)
                 .Include(x => x.Passengers)
                 .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate) && x.CustomerId == userDetails.CustomerId)
                 .AsEnumerable()
                 .GroupBy(x => new { x.Date, x.Customer }).OrderBy(x => new { x.Key.Date, x.Key.Customer.Description })
                 .Select(x => new InvoicingDTO {
                     Customer = new SimpleResource { Id = x.Key.Customer.Id, Description = x.Key.Customer.Description },
                     Ports = x.GroupBy(x => x.Port).OrderBy(x => !x.Key.IsPrimary).Select(x => new InvoicingPortDTO {
                         Port = x.Key.Description,
                         HasTransferGroup = x.GroupBy(x => x.PickupPoint.CoachRoute.HasTransfer).Select(x => new HasTransferGroupDTO {
                             HasTransfer = x.Key,
                             Adults = x.Sum(x => x.Adults),
                             Kids = x.Sum(x => x.Kids),
                             Free = x.Sum(x => x.Free),
                             TotalPersons = x.Sum(x => x.TotalPersons),
                             TotalPassengers = x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn))
                         }).OrderBy(x => !x.HasTransfer),
                         Adults = x.Sum(x => x.Adults),
                         Kids = x.Sum(x => x.Kids),
                         Free = x.Sum(x => x.Free),
                         TotalPersons = x.Sum(x => x.TotalPersons),
                         TotalPassengers = x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn))
                     }),
                     Adults = x.Sum(x => x.Adults),
                     Kids = x.Sum(x => x.Kids),
                     Free = x.Sum(x => x.Free),
                     TotalPersons = x.Sum(x => x.TotalPersons),
                     Reservations = x.OrderBy(x => !x.PickupPoint.CoachRoute.HasTransfer).ToList()
                 }).ToList();
            return mapper.Map<IEnumerable<InvoicingDTO>, IEnumerable<InvoicingReportVM>>(records);
        }

    }

}