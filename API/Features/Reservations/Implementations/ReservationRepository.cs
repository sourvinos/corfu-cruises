using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Features.Drivers;
using API.Features.PickupPoints;
using API.Features.Schedules;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Identity.Models;
using API.Infrastructure.Implementations;
using API.Infrastructure.Middleware;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Reservations {

    public class ReservationRepository : Repository<Reservation>, IReservationRepository {

        private readonly IMapper mapper;
        private readonly TestingEnvironment settings;
        private readonly IHttpContextAccessor httpContextAccessor;

        public ReservationRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings, IHttpContextAccessor httpContextAccessor) : base(appDbContext, settings) {
            this.mapper = mapper;
            this.settings = settings.Value;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<ReservationGroupResource<ReservationListResource>> GetByDate(string date) {
            IEnumerable<Reservation> reservations;
            var connectedUser = await Identity.GetConnectedUserId(httpContextAccessor);
            if (await Identity.IsUserAdmin(httpContextAccessor)) {
                reservations = GetReservationsFromAllUsersByDate(date);
            } else {
                reservations = GetReservationsForConnectedUserbyDate(date, connectedUser);
            }
            var personsPerCustomer = reservations.OrderBy(x => x.Customer.Description).GroupBy(x => new { x.Customer.Description }).Select(x => new PersonsPerCustomer { Description = x.Key.Description, Persons = x.Sum(x => x.TotalPersons) });
            var personsPerDestination = reservations.OrderBy(x => x.Destination.Description).GroupBy(x => new { x.Destination.Description }).Select(x => new PersonsPerDestination { Description = x.Key.Description, Persons = x.Sum(x => x.TotalPersons) });
            var personsPerDriver = reservations.OrderBy(x => x?.Driver?.Description).GroupBy(x => new { x?.Driver?.Description }).Select(x => new PersonsPerDriver { Description = x.Key.Description ?? "(EMPTY)", Persons = x.Sum(x => x.TotalPersons) });
            var personsPerPort = reservations.OrderByDescending(x => x.Port.IsPrimary).GroupBy(x => new { x.Port.Description }).Select(x => new PersonsPerPort { Description = x.Key.Description, Persons = x.Sum(x => x.TotalPersons) });
            var personsPerRoute = reservations.OrderBy(x => x.PickupPoint.CoachRoute.Abbreviation).GroupBy(x => new { x.PickupPoint.CoachRoute.Abbreviation }).Select(x => new PersonsPerRoute { Description = x.Key.Abbreviation, Persons = x.Sum(x => x.TotalPersons) });
            var personsPerShip = reservations.OrderBy(x => x?.Ship?.Description).GroupBy(x => new { x?.Ship?.Description }).Select(x => new PersonsPerShip { Description = x.Key.Description ?? "(EMPTY)", Persons = x.Sum(x => x.TotalPersons) });
            var mainResult = new MainResult<Reservation> {
                Persons = reservations.Sum(x => x.TotalPersons),
                Reservations = reservations.ToList(),
                PersonsPerCustomer = personsPerCustomer.ToList(),
                PersonsPerDestination = personsPerDestination.ToList(),
                PersonsPerDriver = personsPerDriver.ToList(),
                PersonsPerPort = personsPerPort.ToList(),
                PersonsPerRoute = personsPerRoute.ToList(),
                PersonsPerShip = personsPerShip.ToList()
            };
            return mapper.Map<MainResult<Reservation>, ReservationGroupResource<ReservationListResource>>(mainResult);
        }

        public async Task<DriverResult<Reservation>> GetByDateAndDriver(string date, int driverId) {
            var driver = await GetDriver(driverId);
            var reservations = await GetReservationsByDateAndDriver(date, driverId);
            var mainResult = new DriverResult<Reservation> {
                Date = date,
                DriverId = driver != null ? driverId : 0,
                DriverDescription = driver != null ? driver.Description : "(EMPTY)",
                Phones = driver != null ? driver.Phones : "(EMPTY)",
                Reservations = mapper.Map<IEnumerable<Reservation>, IEnumerable<ReservationDriverListResource>>(reservations)
            };
            return mainResult;
        }

        public async Task<ReservationGroupResource<ReservationListResource>> GetByRefNo(string refNo) {
            IEnumerable<Reservation> reservations;
            var connectedUser = await Identity.GetConnectedUserId(httpContextAccessor);
            if (await Identity.IsUserAdmin(httpContextAccessor)) {
                reservations = GetReservationsFromAllUsersByRefNo(refNo);
            } else {
                reservations = GetReservationsForConnectedUserbyRefNo(refNo, connectedUser);
            }
            var personsPerCustomer = reservations.OrderBy(x => x.Customer.Description).GroupBy(x => new { x.Customer.Description }).Select(x => new PersonsPerCustomer { Description = x.Key.Description, Persons = x.Sum(x => x.TotalPersons) });
            var personsPerDestination = reservations.OrderBy(x => x.Destination.Description).GroupBy(x => new { x.Destination.Description }).Select(x => new PersonsPerDestination { Description = x.Key.Description, Persons = x.Sum(x => x.TotalPersons) });
            var personsPerDriver = reservations.OrderBy(x => x?.Driver?.Description).GroupBy(x => new { x?.Driver?.Description }).Select(x => new PersonsPerDriver { Description = x.Key.Description ?? "(EMPTY)", Persons = x.Sum(x => x.TotalPersons) });
            var personsPerPort = reservations.OrderByDescending(x => x.Port.IsPrimary).GroupBy(x => new { x.Port.Description }).Select(x => new PersonsPerPort { Description = x.Key.Description, Persons = x.Sum(x => x.TotalPersons) });
            var personsPerRoute = reservations.OrderBy(x => x.PickupPoint.CoachRoute.Abbreviation).GroupBy(x => new { x.PickupPoint.CoachRoute.Abbreviation }).Select(x => new PersonsPerRoute { Description = x.Key.Abbreviation, Persons = x.Sum(x => x.TotalPersons) });
            var personsPerShip = reservations.OrderBy(x => x?.Ship?.Description).GroupBy(x => new { x?.Ship?.Description }).Select(x => new PersonsPerShip { Description = x.Key.Description ?? "(EMPTY)", Persons = x.Sum(x => x.TotalPersons) });
            var mainResult = new MainResult<Reservation> {
                Persons = reservations.Sum(x => x.TotalPersons),
                Reservations = reservations.ToList(),
                PersonsPerCustomer = personsPerCustomer.ToList(),
                PersonsPerDestination = personsPerDestination.ToList(),
                PersonsPerDriver = personsPerDriver.ToList(),
                PersonsPerPort = personsPerPort.ToList(),
                PersonsPerRoute = personsPerRoute.ToList(),
                PersonsPerShip = personsPerShip.ToList()
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
                : throw new RecordNotFound(ApiMessages.RecordNotFound());
        }

        public async Task<Reservation> GetByIdToDelete(string id) {
            var reservation = await context.Reservations
                .Include(x => x.Passengers)
                .FirstAsync(x => x.ReservationId.ToString() == id);
            return reservation;
        }

        public Task<bool> DoesUserOwnRecord(string userId) {
            return Task.Run(() => httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value == userId);
        }

        public bool IsKeyUnique(ReservationWriteResource record) {
            return !context.Reservations.Any(x =>
               x.Date == Convert.ToDateTime(record.Date) &&
               x.ReservationId != record.ReservationId &&
               x.DestinationId == record.DestinationId &&
               x.CustomerId == record.CustomerId &&
               string.Equals(x.TicketNo, record.TicketNo, StringComparison.OrdinalIgnoreCase));
        }

        public async Task<bool> Update(string id, Reservation updatedRecord) {
            using var transaction = context.Database.BeginTransaction();
            try {
                await UpdateReservation(updatedRecord);
                await RemovePassengers(GetPassengersForReservation(id));
                await AddPassengers(updatedRecord);
                if (settings.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
                return true;
            } catch (Exception) {
                transaction.Rollback();
                return false;
            }
        }

        public async Task<int> GetPortIdFromPickupPointId(ReservationWriteResource record) {
            PickupPoint pickupPoint = await context.PickupPoints
                .Include(x => x.CoachRoute)
                .FirstOrDefaultAsync(x => x.Id == record.PickupPointId);
            return pickupPoint.CoachRoute.PortId;
        }

        public async Task<int> IsValid(ReservationWriteResource record, IScheduleRepository scheduleRepo) {
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
                var x when x == !UserCanAddReservationInThePast(record.Date) => 431,
                var x when x == !scheduleRepo.DayHasSchedule(record.Date) => 432,
                var x when x == !scheduleRepo.DayHasScheduleForDestination(record.Date, record.DestinationId) => 430,
                var x when x == !scheduleRepo.PortHasDepartures(record.Date, record.DestinationId, await GetPortIdFromPickupPointId(record)) => 427,
                var x when x == !PortHasVacancy(scheduleRepo, record.Date, record.Date, record.ReservationId, record.DestinationId, await GetPortIdFromPickupPointId(record), record.Adults + record.Kids + record.Free) => 433,
                var x when x == !IsKeyUnique(record) => 409,
                _ => 200,
            };
        }

        public void AssignToDriver(int driverId, string[] ids) {
            using var transaction = context.Database.BeginTransaction();
            var reservations = context.Reservations
                .Where(x => ids.Contains(x.ReservationId.ToString()))
                .ToList();
            reservations.ForEach(a => a.DriverId = driverId);
            context.SaveChanges();
            if (settings.IsTesting) {
                transaction.Dispose();
            } else {
                transaction.Commit();
            }
        }

        public void AssignToShip(int shipId, string[] ids) {
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
            var passengers = context.Set<Passenger>()
                .Where(x => x.ReservationId.ToString() == id)
                .ToList();
            return passengers;
        }

        private async Task UpdateReservation(Reservation updatedRecord) {
            context.Entry(updatedRecord).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        private async Task AddPassengers(Reservation updatedRecord) {
            var records = new List<Passenger>();
            foreach (var record in updatedRecord.Passengers) {
                records.Add(record);
            }
            context.Set<Passenger>().AddRange(records);
            await context.SaveChangesAsync();
        }

        private async Task RemovePassengers(IEnumerable<Passenger> passengers) {
            context.Set<Passenger>().RemoveRange(passengers);
            await context.SaveChangesAsync();
        }

        private static bool PortHasVacancy(IScheduleRepository scheduleRepo, string fromDate, string toDate, Guid? reservationId, int destinationId, int portId, int reservationPersons) {
            int maxPassengers = GetPortMaxPassengers(scheduleRepo, fromDate, toDate, reservationId, destinationId, portId);
            return maxPassengers >= reservationPersons;
        }

        private static int GetPortMaxPassengers(IScheduleRepository scheduleRepo, string fromDate, string toDate, Guid? reservationId, int destinationId, int portId) {
            IEnumerable<ScheduleReservationGroup> schedule = scheduleRepo.DoCalendarTasks(fromDate, toDate, reservationId).ToList();
            var port = schedule.Select(x => x.Destinations.SingleOrDefault(x => x.Id == destinationId).Ports.SingleOrDefault(x => x.Id == portId)).Select(x => new {
                MaxPassengers = x.AvailableSeats
            }).ToList();
            return port[0].MaxPassengers;
        }

        private bool UserCanAddReservationInThePast(string date) {
            return Identity.IsUserAdmin(httpContextAccessor).Result || DateTime.Parse(date) > DateTime.Now;
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
            var reservations = context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.Date == Convert.ToDateTime(date));
            return reservations;
        }

        private IEnumerable<Reservation> GetReservationsForConnectedUserbyDate(string date, SimpleUser connectedUser) {
            var reservations = context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.Date == Convert.ToDateTime(date) && x.UserId == connectedUser.UserId);
            return reservations;
        }

        private IEnumerable<Reservation> GetReservationsFromAllUsersByRefNo(string refNo) {
            var reservations = context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.RefNo == refNo);
            return reservations;
        }

        private IEnumerable<Reservation> GetReservationsForConnectedUserbyRefNo(string refNo, SimpleUser connectedUser) {
            var reservations = context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.RefNo == refNo && x.UserId == connectedUser.UserId);
            return reservations;
        }

        private async Task<IEnumerable<Reservation>> GetReservationsByDateAndDriver(string date, int driverId) {
            var reservations = await context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint)
                .Include(x => x.Passengers)
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DriverId == (driverId != 0 ? driverId : null))
                .OrderBy(x => x.PickupPoint.Time).ThenBy(x => x.PickupPoint.Description)
                .ToListAsync();
            return reservations;
        }

        private async Task<string> IncrementRefNoByOne() {
            var refNo = context.RefNos.First();
            refNo.LastRefNo++;
            context.Entry(refNo).State = EntityState.Modified;
            using var transaction = context.Database.BeginTransaction();
            await context.SaveChangesAsync();
            if (settings.IsTesting) {
                transaction.Dispose();
            } else {
                transaction.Commit();
            }
            return refNo.LastRefNo.ToString();
        }

        private async Task<string> GetDestinationAbbreviation(ReservationWriteResource record) {
            var destination = await context.Destinations
                .FirstOrDefaultAsync(x => x.Id == record.DestinationId);
            return destination.Abbreviation;
        }

        private async Task<Driver> GetDriver(int driverId) {
            var driver = await context.Drivers
                .FirstOrDefaultAsync(x => x.Id == driverId);
            return driver;
        }

    }

}