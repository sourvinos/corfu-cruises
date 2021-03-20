using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class BookingRepository : Repository<Booking>, IBookingRepository {

        private readonly IMapper mapper;

        public BookingRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<BookingGroupResultResource<BookingResource>> Get(string date) {
            DateTime _date = Convert.ToDateTime(date);
            var details = await context.Bookings
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.Date == _date)
                .OrderBy(x => x.Date).ToListAsync();
            var totalPersonsPerCustomer = context.Bookings.Include(x => x.Customer).Where(x => x.Date == _date).GroupBy(x => new { x.Customer.Description }).Select(x => new TotalPersonsPerCustomer { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var totalPersonsPerDestination = context.Bookings.Include(x => x.Destination).Where(x => x.Date == _date).GroupBy(x => new { x.Destination.Description }).Select(x => new TotalPersonsPerDestination { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var totalPersonsPerRoute = context.Bookings.Include(x => x.PickupPoint.Route).Where(x => x.Date == _date).GroupBy(x => new { x.PickupPoint.Route.Abbreviation }).Select(x => new TotalPersonsPerRoute { Description = x.Key.Abbreviation, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var totalPersonsPerDriver = context.Bookings.Include(x => x.Driver).Where(x => x.Date == _date).OrderBy(o => o.Driver.Description).GroupBy(x => new { x.Driver.Description }).Select(x => new TotalPersonsPerDriver { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var totalPersonsPerPort = context.Bookings.Include(x => x.PickupPoint.Route.Port).Where(x => x.Date == _date).OrderBy(o => o.PickupPoint.Route.Port.Description).GroupBy(x => new { x.PickupPoint.Route.Port.Description }).Select(x => new TotalPersonsPerPort { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var totalPersonsPerShip = context.Bookings.Include(x => x.Ship).Where(x => x.Date == _date).OrderBy(o => o.Ship.Description).GroupBy(x => new { x.Ship.Description }).Select(x => new TotalPersonsPerShip { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var groupResult = new BookingGroupResult<Booking> {
                Persons = details.Sum(x => x.TotalPersons),
                Bookings = details.ToList(),
                PersonsPerCustomer = totalPersonsPerCustomer.ToList(),
                PersonsPerDestination = totalPersonsPerDestination.ToList(),
                PersonsPerRoute = totalPersonsPerRoute.ToList(),
                PersonsPerDriver = totalPersonsPerDriver.ToList(),
                PersonsPerPort = totalPersonsPerPort.ToList(),
                PersonsPerShip = totalPersonsPerShip.ToList()
            };
            return mapper.Map<BookingGroupResult<Booking>, BookingGroupResultResource<BookingResource>>(groupResult);
        }

        public new async Task<Booking> GetById(int id) {
            return await context.Bookings
                .Include(x => x.Customer)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.Ship)
                .Include(x => x.Details).ThenInclude(x => x.Nationality)
                .Include(x => x.Details).ThenInclude(x => x.Occupant)
                .Include(x => x.Details).ThenInclude(x => x.Gender)
                .SingleOrDefaultAsync(x => x.BookingId == id);
        }

        public void UpdateWithDetails(int id, Booking updatedRecord) {
            using var transaction = context.Database.BeginTransaction();
            try {
                context.Entry(updatedRecord).State = EntityState.Modified;
                context.SaveChanges();
                this.RemoveDetails(GetBookingById(id));
                this.AddDetails(updatedRecord);
                transaction.Commit();
            } catch (System.Exception) {
                throw;
            }
        }

        public void AssignToDriver(int driverId, int[] ids) {
            var bookings = context.Bookings.Where(x => ids.Contains(x.BookingId)).ToList();
            bookings.ForEach(a => a.DriverId = driverId);
            context.SaveChanges();
        }

        public void AssignToShip(int shipId, int[] ids) {
            var bookings = context.Bookings.Where(x => ids.Contains(x.BookingId)).ToList();
            bookings.ForEach(a => a.ShipId = shipId);
            context.SaveChanges();
        }

        private Booking GetBookingById(int id) {
            var booking = context.Bookings
                .Include(x => x.Details)
                .AsNoTracking()
                .SingleOrDefault(x => x.BookingId == id);
            return booking;
        }

        private void RemoveDetails(Booking currentRecord) {
            context.BookingDetails.RemoveRange(currentRecord.Details);
            context.SaveChanges();
        }

        private void AddDetails(Booking updatedRecord) {
            var newDetails = new List<BookingDetail>();
            foreach (var item in updatedRecord.Details) {
                newDetails.Add(item);
            };
            context.BookingDetails.AddRange(newDetails);
            context.SaveChanges();
        }

        public IEnumerable<BookingPerDestinationAndPort> GetForDestinationAndPort(int destinationId, int portId) {
            var totalPersonsPerCustomer = context.Bookings
                .Where(x => x.DestinationId == destinationId && x.PortId == portId)
                .GroupBy(x => x.Date)
                .Select(x => new BookingPerDestinationAndPort { Date = x.Key.Date, Persons = x.Sum(s => s.TotalPersons) })
                .OrderBy(o => o.Date);
            return totalPersonsPerCustomer.ToList();
        }

    }

}