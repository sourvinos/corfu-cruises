using System.Collections.Generic;
using System.Linq;
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

        public IEnumerable<InvoicingReadResource> Get(string date) {
            var result = context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Ship)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route)
                .Include(x => x.Passengers)
                .Where(x => x.Date == date && x.Passengers.Any(x => x.IsCheckedIn))
                .AsEnumerable()
                .OrderBy(x => x.Customer.Description)
                .GroupBy(x => new { x.Customer.Description, x.PickupPoint.Route.IsTransfer })
                .Select(x => new InvoicingGroup {
                    Adults = x.Sum(x => x.Adults),
                    Kids = x.Sum(x => x.Kids),
                    Free = x.Sum(x => x.Free),
                    TotalPersons = x.Sum(x => x.TotalPersons),
                    IsTransfer = x.Key.IsTransfer,
                    Reservations = x
                }).ToList();
            return mapper.Map<IEnumerable<InvoicingGroup>, IEnumerable<InvoicingReadResource>>(result);
        }

    }

}