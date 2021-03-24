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

        public async Task<BoardingGroup> Get(string date, int destinationId, int portId, int shipId) {
            DateTime _date = Convert.ToDateTime(date);
            var boardings = await context.Bookings
                .Include(x => x.Details)
                .Where(x => x.Date == _date && x.DestinationId == destinationId && x.PortId == portId && x.ShipId == shipId)
                .ToListAsync();
            int count = boardings.SelectMany(c => c.Details).Count();
            int countBoarded = boardings.SelectMany(c => c.Details).Where(x => x.IsCheckedIn).Count();
            int countRemain = count - countBoarded;
            var groupResult = new BoardingGroup {
                AllPersons = count,
                BoardedPersons = countBoarded,
                RemainingPersons = countRemain,
                Boardings = boardings.ToList()
            };

            // Working
            // int count = context.Bookings.Include(x => x.Details)
            //                     .SelectMany(c => c.Details)
            //                     .Where(x => x.IsCheckedIn)
            //                     .Count();
            return groupResult;
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