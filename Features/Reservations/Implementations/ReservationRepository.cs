using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Features.Schedules;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Reservations {

    public class ReservationRepository : Repository<Reservation>, IReservationRepository {

        private readonly IMapper mapper;
        private readonly UserManager<AppUser> userManager;

        public ReservationRepository(DbContext appDbContext, IMapper mapper, UserManager<AppUser> userManager) : base(appDbContext) {
            this.mapper = mapper;
            this.userManager = userManager;
        }

        public async Task<ReservationGroupResource<ReservationListResource>> GetForDate(string date) {
            var reservations = await context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Include(x => x.User)
                .Where(x => x.Date == Convert.ToDateTime(date))
                .OrderBy(x => x.Date).ToListAsync();
            var PersonsPerCustomer = context.Reservations.Include(x => x.Customer).Where(x => x.Date == Convert.ToDateTime(date)).GroupBy(x => new { x.Customer.Description }).Select(x => new PersonsPerCustomer { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var PersonsPerDestination = context.Reservations.Include(x => x.Destination).Where(x => x.Date == Convert.ToDateTime(date)).GroupBy(x => new { x.Destination.Description }).Select(x => new PersonsPerDestination { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var PersonsPerRoute = context.Reservations.Include(x => x.PickupPoint.Route).Where(x => x.Date == Convert.ToDateTime(date)).GroupBy(x => new { x.PickupPoint.Route.Abbreviation }).Select(x => new PersonsPerRoute { Description = x.Key.Abbreviation, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var PersonsPerDriver = context.Reservations.Include(x => x.Driver).Where(x => x.Date == Convert.ToDateTime(date)).OrderBy(o => o.Driver.Description).GroupBy(x => new { x.Driver.Description }).Select(x => new PersonsPerDriver { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var PersonsPerPort = context.Reservations.Include(x => x.PickupPoint.Route.Port).Where(x => x.Date == Convert.ToDateTime(date)).OrderBy(o => o.PickupPoint.Route.Port.Description).GroupBy(x => new { x.PickupPoint.Route.Port.Description }).Select(x => new PersonsPerPort { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var totalPersonsPerShip = context.Reservations.Include(x => x.Ship).Where(x => x.Date == Convert.ToDateTime(date)).OrderBy(o => o.Ship.Description).GroupBy(x => new { x.Ship.Description }).Select(x => new PersonsPerShip { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var mainResult = new MainResult<Reservation> {
                Persons = reservations.Sum(x => x.TotalPersons),
                Reservations = reservations.ToList(),
                PersonsPerCustomer = PersonsPerCustomer.ToList(),
                PersonsPerDestination = PersonsPerDestination.ToList(),
                PersonsPerRoute = PersonsPerRoute.ToList(),
                PersonsPerDriver = PersonsPerDriver.ToList(),
                PersonsPerPort = PersonsPerPort.ToList(),
                PersonsPerShip = totalPersonsPerShip.ToList()
            };
            return mapper.Map<MainResult<Reservation>, ReservationGroupResource<ReservationListResource>>(mainResult);
        }

        public IEnumerable<MainResult> GetForDestination(int destinationId) {
            var totalReservationsPerDestination = context.Reservations
                .Where(x => x.DestinationId == destinationId)
                .AsEnumerable()
                .GroupBy(x => new { x.Date })
                .Select(x => new MainResult {
                    Date = Convert.ToDateTime(x.Key.Date),
                    DestinationId = destinationId,
                    PortPersons = x.GroupBy(z => z.PortId).Select(z => new PortPersons {
                        PortId = z.Key,
                        Persons = z.Sum(x => x.TotalPersons)
                    }).OrderBy(x => x.PortId)
                }).OrderBy(x => x.Date);
            return totalReservationsPerDestination;
        }

        public ReservationTotalPersons GetForDateAndDestinationAndPort(string date, int destinationId, int portId) {
            var totalPersons = context.Reservations
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId && x.PortId == portId)
                .Sum(x => x.TotalPersons);
            var reservationTotalPersons = new ReservationTotalPersons {
                Date = date,
                DestinationId = destinationId,
                PortId = portId,
                TotalPersons = totalPersons
            };
            return reservationTotalPersons;
        }

        public async Task<ReservationReadResource> GetSingle(string id) {
            var reservation = await context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.Ship)
                .Include(x => x.User)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
                .Include(x => x.Passengers).ThenInclude(x => x.Gender)
                .FirstAsync(x => x.ReservationId.ToString() == id);
            return mapper.Map<Reservation, ReservationReadResource>(reservation);
        }

        public async Task<Reservation> GetSingleToDelete(string id) {
            var reservation = await context.Reservations
                .Include(x => x.Passengers)
                .FirstAsync(x => x.ReservationId.ToString() == id);
            return reservation;
        }

        public bool Update(string id, Reservation updatedRecord) {
            using var transaction = context.Database.BeginTransaction();
            try {
                UpdateReservation(updatedRecord);
                RemovePassengers(GetPassengersForReservation(id));
                AddPassengers(updatedRecord);
                transaction.Commit();
                return true;
            } catch (Exception) {
                transaction.Rollback();
                return false;
            }
        }

        public void AssignToDriver(int driverId, string[] ids) {
            var reservations = context.Reservations.Where(x => ids.Contains(x.ReservationId.ToString())).ToList();
            reservations.ForEach(a => a.DriverId = driverId);
            context.SaveChanges();
        }

        public void AssignToShip(int shipId, string[] ids) {
            var records = context.Reservations.Where(x => ids.Contains(x.ReservationId.ToString())).ToList();
            records.ForEach(a => a.ShipId = shipId);
            context.SaveChanges();
        }

        private IEnumerable<Passenger> GetPassengersForReservation(string id) {
            var passengers = context.Passengers.Where(x => x.ReservationId.ToString() == id).ToList();
            return passengers;
        }

        private void UpdateReservation(Reservation updatedRecord) {
            context.Entry(updatedRecord).State = EntityState.Modified;
            context.SaveChanges();
        }

        private void RemovePassengers(IEnumerable<Passenger> passengers) {
            context.Passengers.RemoveRange(passengers);
            context.SaveChanges();
        }

        private void AddPassengers(Reservation updatedRecord) {
            var records = new List<Passenger>();
            foreach (var record in updatedRecord.Passengers) {
                records.Add(record);
            };
            context.Passengers.AddRange(records);
            context.SaveChanges();
        }

        public bool IsKeyUnique(ReservationWriteResource record) {
            if (context.Reservations.Count(x => x.Date == Convert.ToDateTime(record.Date) && x.DestinationId == record.DestinationId && x.CustomerId == record.CustomerId && x.TicketNo.ToUpper() == record.TicketNo.ToUpper()) == 0) {
                return true;
            }
            return false;
        }

        private bool IsUserAdmin(bool isAdmin) {
            return isAdmin;
        }

        public IEnumerable<ReservationResource> GetForPeriod(string fromDate, string toDate) {
            var response = context.Reservations
                .Include(x => x.Destination)
                .Include(x => x.Port)
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate))
                .OrderBy(x => x.Date).ThenBy(x => x.Destination.Description).ThenBy(x => !x.Port.IsPrimary)
                .AsEnumerable()
                .GroupBy(x => x.Date)
                .Select(x => new ReservationResource {
                    Date = Extensions.DateToString(x.Key.Date),
                    Destinations = x.GroupBy(x => new { x.Destination.Id, x.Destination.Description })
                        .Select(x => new DestinationResource {
                            Id = x.Key.Id,
                            Description = x.Key.Description,
                            Ports = x.GroupBy(x => new { x.Port.Id, x.Port.Description }).Select(x => new PortResource {
                                Id = x.Key.Id,
                                Description = x.Key.Description,
                                Persons = x.Select(r => r.TotalPersons).Sum()
                            })
                        }).ToList()
                }).ToList();
            return response;
        }

        public int IsValid(ReservationWriteResource record, IScheduleRepository scheduleRepo) {
            switch (true) {
                case var x when x = !scheduleRepo.DayHasSchedule(DateTime.Parse(record.Date)):
                    return 432;
                case var x when x = !scheduleRepo.DayHasScheduleForDestination(DateTime.Parse(record.Date), record.DestinationId):
                    return 430;
                case var x when x = !scheduleRepo.PortHasDepartures(DateTime.Parse(record.Date), record.DestinationId, record.PortId):
                    return 427;
                case var x when x = !PortHasVacancy(scheduleRepo, record.Date, record.Date, record.DestinationId, record.PortId, record.Adults + record.Kids + record.Free):
                    return 433;
                case var x when x = !this.IsKeyUnique(record):
                    return 409;
                default:
                    return 200;
            };
        }

        private bool PortHasVacancy(IScheduleRepository scheduleRepo, string fromDate, string toDate, int destinationId, int portId, int reservationPersons) {
            int maxPersons = this.GetPortMaxPersons(scheduleRepo, fromDate, toDate, destinationId, portId);
            return maxPersons >= reservationPersons;
        }

        private int GetPortMaxPersons(IScheduleRepository scheduleRepo, string fromDate, string toDate, int destinationId, int portId) {
            IEnumerable<ScheduleReservationGroup> schedule = scheduleRepo.DoTasks(fromDate, toDate).ToList();
            var port = schedule.Select(x => x.Destinations.SingleOrDefault(x => x.Id == destinationId).Ports.SingleOrDefault(x => x.Id == portId)).Select(x => new { MaxPersons = x.Empty }).ToList();
            return port[0].MaxPersons;
        }

    }

}