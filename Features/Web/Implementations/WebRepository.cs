using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class WebRepository : Repository<Reservation>, IWebRepository {

        private readonly IMapper mapper;

        public WebRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
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