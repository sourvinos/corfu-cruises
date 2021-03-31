using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace CorfuCruises {

    public class BoardingRepository : Repository<Rsv>, IBoardingRepository {

        private readonly IMapper mapper;

        public BoardingRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<BoardingGroupResultResource<BoardingResource>> Get(string date, int destinationId, int portId, int shipId) {
            DateTime _date = Convert.ToDateTime(date);
            var details = await context.Rsvs
                .Include(x => x.Passengers)
                .Where(x => x.Date == _date && x.DestinationId == destinationId && x.PortId == portId && x.ShipId == shipId)
                .ToListAsync();
            int count = details.SelectMany(c => c.Passengers).Count();
            int countBoarded = details.SelectMany(c => c.Passengers).Where(x => x.IsCheckedIn).Count();
            int countRemain = count - countBoarded;
            var groupResult = new BoardingGroupResult<Rsv> {
                AllPersons = count,
                BoardedPersons = countBoarded,
                RemainingPersons = countRemain,
                Boardings = details.ToList()
            };
            return mapper.Map<BoardingGroupResult<Rsv>, BoardingGroupResultResource<BoardingResource>>(groupResult);
        }

        public bool DoBoarding(int id) {
            RsvPassenger passenger = context.RsvsPassengers.Where(x => x.Id == id).FirstOrDefault();
            if (passenger != null) {
                passenger.IsCheckedIn = true;
                context.SaveChanges();
                return true;
            } else {
                return false;
            }
        }

    }

}