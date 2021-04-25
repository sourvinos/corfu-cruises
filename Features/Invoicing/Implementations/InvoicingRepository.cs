using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class InvoicingRepository : IInvoicingRepository {

        private readonly DbContext context;
        private readonly IMapper mapper;

        public InvoicingRepository(DbContext appDbContext, IMapper mapper) {
            this.context = appDbContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<InvoicingReadResource>> Get(string date) {
            var reservations = await context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.Date == date && x.Passengers.Any(x => x.IsCheckedIn))
                .OrderBy(x => x.Customer.Description).ThenBy(x => x.Destination.Description).ThenBy(x => x.PickupPoint.Route.IsTransfer)
                .ToListAsync();
            return mapper.Map<IEnumerable<InvoicingReadResource>>(reservations);
        }

    }

}