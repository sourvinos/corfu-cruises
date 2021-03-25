using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace CorfuCruises {

    public class BoardingRepository : Repository<Booking>, IBoardingRepository {

        private readonly IMapper mapper;

        public BoardingRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<BoardingGroupResultResource<BoardingResource>> Get(string date, int destinationId, int portId, int shipId) {
            DateTime _date = Convert.ToDateTime(date);
            var details = await context.Bookings
                .Include(x => x.Details)
                .Where(x => x.Date == _date && x.DestinationId == destinationId && x.PortId == portId && x.ShipId == shipId)
                .ToListAsync();
            int count = details.SelectMany(c => c.Details).Count();
            int countBoarded = details.SelectMany(c => c.Details).Where(x => x.IsCheckedIn).Count();
            int countRemain = count - countBoarded;
            var groupResult = new BoardingGroupResult<Booking> {
                AllPersons = count,
                BoardedPersons = countBoarded,
                RemainingPersons = countRemain,
                Boardings = details.ToList()
            };
            return mapper.Map<BoardingGroupResult<Booking>, BoardingGroupResultResource<BoardingResource>>(groupResult);
        }

        public bool DoBoarding(int id) {
            BookingDetail bookingDetail = context.BookingDetails.Where(x => x.Id == id).FirstOrDefault();
            if (bookingDetail != null) {
                bookingDetail.IsCheckedIn = true;
                context.SaveChanges();
                return true;
            } else {
                return false;
            }
        }

    }

}