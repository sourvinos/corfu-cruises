using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
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

        public async Task<ReservationGroupResource<ReservationListResource>> Get(string date) {
            IEnumerable<Reservation> reservations;
            var connectedUser = await Identity.GetConnectedUserId(httpContextAccessor);
            if (await Identity.IsUserAdmin(httpContextAccessor)) {
                reservations = GetReservationsFromAllUsers(date);
            } else {
                reservations = GetReservationsForConnectedUser(date, connectedUser);
            }
            var personsPerCustomer = reservations.OrderBy(x => x.Customer.Description).GroupBy(x => new { x.Customer.Description }).Select(x => new PersonsPerCustomer { Description = x.Key.Description, Persons = x.Sum(x => x.TotalPersons) });
            var personsPerDestination = reservations.OrderBy(x => x.Destination.Description).GroupBy(x => new { x.Destination.Description }).Select(x => new PersonsPerDestination { Description = x.Key.Description, Persons = x.Sum(x => x.TotalPersons) });
            var personsPerDriver = reservations.OrderBy(x => x?.Driver?.Description).GroupBy(x => new { x?.Driver?.Description }).Select(x => new PersonsPerDriver { Description = x.Key.Description ?? "(EMPTY)", Persons = x.Sum(x => x.TotalPersons) });
            var personsPerPort = reservations.OrderByDescending(x => x.Port.IsPrimary).GroupBy(x => new { x.Port.Description }).Select(x => new PersonsPerPort { Description = x.Key.Description, Persons = x.Sum(x => x.TotalPersons) });
            var personsPerRoute = reservations.OrderBy(x => x.PickupPoint.Route.Abbreviation).GroupBy(x => new { x.PickupPoint.Route.Abbreviation }).Select(x => new PersonsPerRoute { Description = x.Key.Abbreviation, Persons = x.Sum(x => x.TotalPersons) });
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
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
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

        public bool Update(string id, Reservation updatedRecord) {
            using var transaction = context.Database.BeginTransaction();
            try {
                UpdateReservation(updatedRecord);
                RemovePassengers(GetPassengersForReservation(id));
                AddPassengers(updatedRecord);
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

        public int GetPortIdFromPickupPointId(ReservationWriteResource record) {
            PickupPoint pickupPoint = context.PickupPoints
                .Include(x => x.Route)
                .FirstOrDefault(x => x.Id == record.PickupPointId);
            return pickupPoint.Route.PortId;
        }

        public int IsValid(ReservationWriteResource record, IScheduleRepository scheduleRepo) {
            return true switch {
                var x when x == !IsValidCustomer(record) => 450,
                var x when x == !IsValidDestination(record) => 451,
                var x when x == !IsValidPickupPoint(record) => 452,
                var x when x == !IsValidDriver(record) => 453,
                var x when x == !IsValidShip(record) => 454,
                var x when x == !IsCorrectPassengerCount(record) => 455,
                var x when x == !IsValidNationality(record) => 456,
                var x when x == !IsValidGender(record) => 457,
                var x when x == !IsValidOccupant(record) => 458,
                var x when x == !UserCanAddReservationInThePast(record.Date) => 431,
                var x when x == !scheduleRepo.DayHasSchedule(record.Date) => 432,
                var x when x == !scheduleRepo.DayHasScheduleForDestination(record.Date, record.DestinationId) => 430,
                var x when x == !scheduleRepo.PortHasDepartures(record.Date, record.DestinationId, GetPortIdFromPickupPointId(record)) => 427,
                var x when x == !PortHasVacancy(scheduleRepo, record.Date, record.Date, record.ReservationId, record.DestinationId, GetPortIdFromPickupPointId(record), record.Adults + record.Kids + record.Free) => 433,
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

        private IEnumerable<Passenger> GetPassengersForReservation(string id) {
            var passengers = context.Set<Passenger>()
                .Where(x => x.ReservationId.ToString() == id)
                .ToList();
            return passengers;
        }

        private void UpdateReservation(Reservation updatedRecord) {
            context.Entry(updatedRecord).State = EntityState.Modified;
            context.SaveChanges();
        }

        private void AddPassengers(Reservation updatedRecord) {
            var records = new List<Passenger>();
            foreach (var record in updatedRecord.Passengers) {
                records.Add(record);
            }
            context.Set<Passenger>().AddRange(records);
            context.SaveChanges();
        }

        private void RemovePassengers(IEnumerable<Passenger> passengers) {
            context.Set<Passenger>().RemoveRange(passengers);
            context.SaveChanges();
        }

        private static bool PortHasVacancy(IScheduleRepository scheduleRepo, string fromDate, string toDate, Guid? reservationId, int destinationId, int portId, int reservationPersons) {
            int maxPersons = GetPortMaxPersons(scheduleRepo, fromDate, toDate, reservationId, destinationId, portId);
            return maxPersons >= reservationPersons;
        }

        private static int GetPortMaxPersons(IScheduleRepository scheduleRepo, string fromDate, string toDate, Guid? reservationId, int destinationId, int portId) {
            IEnumerable<ScheduleReservationGroup> schedule = scheduleRepo.DoCalendarTasks(fromDate, toDate, reservationId).ToList();
            var port = schedule.Select(x => x.Destinations.SingleOrDefault(x => x.Id == destinationId).Ports.SingleOrDefault(x => x.Id == portId)).Select(x => new {
                MaxPersons = x.AvailableSeats
            }).ToList();
            return port[0].MaxPersons;
        }

        private bool UserCanAddReservationInThePast(string date) {
            return Identity.IsUserAdmin(httpContextAccessor).Result || DateTime.Parse(date) > DateTime.Now;
        }

        private bool IsValidCustomer(ReservationWriteResource record) {
            if (record.ReservationId == Guid.Empty) {
                return context.Customers.SingleOrDefault(x => x.Id == record.CustomerId && x.IsActive) != null;
            }
            return context.Customers.SingleOrDefault(x => x.Id == record.CustomerId) != null;
        }

        private bool IsValidDestination(ReservationWriteResource record) {
            if (record.ReservationId == Guid.Empty) {
                return context.Destinations.SingleOrDefault(x => x.Id == record.DestinationId && x.IsActive) != null;
            }
            return context.Destinations.SingleOrDefault(x => x.Id == record.DestinationId) != null;
        }

        private bool IsValidPickupPoint(ReservationWriteResource record) {
            if (record.ReservationId == Guid.Empty) {
                return context.PickupPoints.SingleOrDefault(x => x.Id == record.PickupPointId && x.IsActive) != null;
            }
            return context.PickupPoints.SingleOrDefault(x => x.Id == record.PickupPointId) != null;
        }

        private bool IsValidDriver(ReservationWriteResource record) {
            if (record.DriverId != null && record.DriverId != 0) {
                if (record.ReservationId == Guid.Empty) {
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
                if (record.ReservationId == Guid.Empty) {
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
                    if (record.ReservationId == Guid.Empty) {
                        isValid = context.Nationalities.SingleOrDefault(x => x.Id == passenger.NationalityId && x.IsActive) != null;
                    }
                    isValid = context.Nationalities.SingleOrDefault(x => x.Id == passenger.NationalityId) != null;
                }
                return record.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidGender(ReservationWriteResource record) {
            if (record.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in record.Passengers) {
                    if (record.ReservationId == Guid.Empty) {
                        isValid = context.Genders.SingleOrDefault(x => x.Id == passenger.GenderId && x.IsActive) != null;
                    }
                    isValid = context.Genders.SingleOrDefault(x => x.Id == passenger.GenderId) != null;
                }
                return record.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidOccupant(ReservationWriteResource record) {
            if (record.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in record.Passengers) {
                    if (record.ReservationId == Guid.Empty) {
                        isValid = context.Occupants.SingleOrDefault(x => x.Id == passenger.OccupantId && x.IsActive) != null;
                    }
                    isValid = context.Occupants.SingleOrDefault(x => x.Id == passenger.OccupantId) != null;
                }
                return record.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private IEnumerable<Reservation> GetReservationsFromAllUsers(string date) {
            var reservations = context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.Date == Convert.ToDateTime(date));
            return reservations;
        }

        private IEnumerable<Reservation> GetReservationsForConnectedUser(string date, SimpleUser connectedUser) {
            var reservations = context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.Date == Convert.ToDateTime(date) && x.UserId == connectedUser.UserId);
            return reservations;
        }

    }

}