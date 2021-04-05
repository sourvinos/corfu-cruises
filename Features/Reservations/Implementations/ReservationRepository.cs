using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class ReservationRepository : Repository<Reservation>, IReservationRepository {

        private readonly IMapper mapper;

        public ReservationRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<ReservationGroupReadResource<ReservationReadResource>> Get(string date) {
            var reservations = await context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.Date == date)
                .OrderBy(x => x.Date).ToListAsync();
            var PersonsPerCustomer = context.Reservations.Include(x => x.Customer).Where(x => x.Date == date).GroupBy(x => new { x.Customer.Description }).Select(x => new PersonsPerCustomer { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var PersonsPerDestination = context.Reservations.Include(x => x.Destination).Where(x => x.Date == date).GroupBy(x => new { x.Destination.Description }).Select(x => new PersonsPerDestination { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var PersonsPerRoute = context.Reservations.Include(x => x.PickupPoint.Route).Where(x => x.Date == date).GroupBy(x => new { x.PickupPoint.Route.Abbreviation }).Select(x => new PersonsPerRoute { Description = x.Key.Abbreviation, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var PersonsPerDriver = context.Reservations.Include(x => x.Driver).Where(x => x.Date == date).OrderBy(o => o.Driver.Description).GroupBy(x => new { x.Driver.Description }).Select(x => new PersonsPerDriver { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var PersonsPerPort = context.Reservations.Include(x => x.PickupPoint.Route.Port).Where(x => x.Date == date).OrderBy(o => o.PickupPoint.Route.Port.Description).GroupBy(x => new { x.PickupPoint.Route.Port.Description }).Select(x => new PersonsPerPort { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var totalPersonsPerShip = context.Reservations.Include(x => x.Ship).Where(x => x.Date == date).OrderBy(o => o.Ship.Description).GroupBy(x => new { x.Ship.Description }).Select(x => new PersonsPerShip { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
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
            return mapper.Map<MainResult<Reservation>, ReservationGroupReadResource<ReservationReadResource>>(mainResult);
        }

        public IEnumerable<MainResult> GetForDestination(int destinationId) {
            var totalReservationsPerDestination = context.Reservations
                .Where(x => x.DestinationId == destinationId)
                .AsEnumerable()
                .GroupBy(x => new { x.Date })
                .Select(x => new MainResult {
                    Date = x.Key.Date,
                    DestinationId = destinationId,
                    PortPersons = x.GroupBy(z => z.PortId).Select(z => new PortPersons {
                        PortId = z.Key,
                        Persons = z.Sum(x => x.TotalPersons)
                    }).OrderBy(x => x.PortId)
                }).OrderBy(x => x.Date);
            return totalReservationsPerDestination;
        }

        public async Task<Reservation> GetById(string id) {
            return await context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.Ship)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
                .Include(x => x.Passengers).ThenInclude(x => x.Gender)
                .FirstAsync(x => x.ReservationId.ToString() == id);
        }

        public bool Update(string id, Reservation updatedRecord) {
            using var transaction = context.Database.BeginTransaction();
            try {
                context.Entry(updatedRecord).State = EntityState.Modified;
                context.SaveChanges();
                RemovePassengers(GetReservationById(id));
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

        private Reservation GetReservationById(string id) {
            var record = context.Reservations
                .Include(x => x.Passengers)
                .AsNoTracking()
                .SingleOrDefault(x => x.ReservationId.ToString() == id);
            return record;
        }

        private void RemovePassengers(Reservation currentRecord) {
            context.Passengers.RemoveRange(currentRecord.Passengers);
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

    }

}