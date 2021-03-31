using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class RsvRepository : Repository<Rsv>, IRsvRepository {

        private readonly IMapper mapper;

        public RsvRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<RsvGroupResultResource<RsvResource>> Get(string date) {
            DateTime _date = Convert.ToDateTime(date);
            var details = await context.Rsvs
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.Date == _date)
                .OrderBy(x => x.Date).ToListAsync();
            var totalPersonsPerCustomer = context.Rsvs.Include(x => x.Customer).Where(x => x.Date == _date).GroupBy(x => new { x.Customer.Description }).Select(x => new TotalPersonsPerCustomer { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var totalPersonsPerDestination = context.Rsvs.Include(x => x.Destination).Where(x => x.Date == _date).GroupBy(x => new { x.Destination.Description }).Select(x => new TotalPersonsPerDestination { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var totalPersonsPerRoute = context.Rsvs.Include(x => x.PickupPoint.Route).Where(x => x.Date == _date).GroupBy(x => new { x.PickupPoint.Route.Abbreviation }).Select(x => new TotalPersonsPerRoute { Description = x.Key.Abbreviation, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var totalPersonsPerDriver = context.Rsvs.Include(x => x.Driver).Where(x => x.Date == _date).OrderBy(o => o.Driver.Description).GroupBy(x => new { x.Driver.Description }).Select(x => new TotalPersonsPerDriver { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var totalPersonsPerPort = context.Rsvs.Include(x => x.PickupPoint.Route.Port).Where(x => x.Date == _date).OrderBy(o => o.PickupPoint.Route.Port.Description).GroupBy(x => new { x.PickupPoint.Route.Port.Description }).Select(x => new TotalPersonsPerPort { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var totalPersonsPerShip = context.Rsvs.Include(x => x.Ship).Where(x => x.Date == _date).OrderBy(o => o.Ship.Description).GroupBy(x => new { x.Ship.Description }).Select(x => new TotalPersonsPerShip { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var groupResult = new RsvGroupResult<Rsv> {
                Persons = details.Sum(x => x.TotalPersons),
                Rsvs = details.ToList(),
                PersonsPerCustomer = totalPersonsPerCustomer.ToList(),
                PersonsPerDestination = totalPersonsPerDestination.ToList(),
                PersonsPerRoute = totalPersonsPerRoute.ToList(),
                PersonsPerDriver = totalPersonsPerDriver.ToList(),
                PersonsPerPort = totalPersonsPerPort.ToList(),
                PersonsPerShip = totalPersonsPerShip.ToList()
            };
            return mapper.Map<RsvGroupResult<Rsv>, RsvGroupResultResource<RsvResource>>(groupResult);
        }

        public new async Task<Rsv> GetById(int id) {
            return await context.Rsvs
                .Include(x => x.Customer)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.Ship)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
                .Include(x => x.Passengers).ThenInclude(x => x.Gender)
                .SingleOrDefaultAsync(x => x.RsvId == id);
        }

        public void UpdateWithDetails(int id, Rsv updatedRecord) {
            using var transaction = context.Database.BeginTransaction();
            try {
                context.Entry(updatedRecord).State = EntityState.Modified;
                context.SaveChanges();
                this.RemoveDetails(GetRsvById(id));
                this.AddDetails(updatedRecord);
                transaction.Commit();
            } catch (System.Exception) {
                throw;
            }
        }

        public void AssignToDriver(int driverId, int[] ids) {
            var rsvs = context.Rsvs.Where(x => ids.Contains(x.RsvId)).ToList();
            rsvs.ForEach(a => a.DriverId = driverId);
            context.SaveChanges();
        }

        public void AssignToShip(int shipId, int[] ids) {
            var records = context.Rsvs.Where(x => ids.Contains(x.RsvId)).ToList();
            records.ForEach(a => a.ShipId = shipId);
            context.SaveChanges();
        }

        private Rsv GetRsvById(int id) {
            var record = context.Rsvs
                .Include(x => x.Passengers)
                .AsNoTracking()
                .SingleOrDefault(x => x.RsvId == id);
            return record;
        }

        private void RemoveDetails(Rsv currentRecord) {
            context.RsvsPassengers.RemoveRange(currentRecord.Passengers);
            context.SaveChanges();
        }

        private void AddDetails(Rsv updatedRecord) {
            var records = new List<RsvPassenger>();
            foreach (var record in updatedRecord.Passengers) {
                records.Add(record);
            };
            context.RsvsPassengers.AddRange(records);
            context.SaveChanges();
        }

        public IEnumerable<RsvPerDestinationAndPort> GetForDestinationAndPort(int destinationId, int portId) {
            var totalPersonsPerCustomer = context.Rsvs
                .Where(x => x.DestinationId == destinationId && x.PortId == portId)
                .GroupBy(x => x.Date)
                .Select(x => new RsvPerDestinationAndPort { Date = x.Key.Date, Persons = x.Sum(s => s.TotalPersons) })
                .OrderBy(o => o.Date);
            return totalPersonsPerCustomer.ToList();
        }

    }

}