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

        public IEnumerable<InvoiceViewModel> Get(string date) {
            var result = context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Ship)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route)
                .OrderBy(x => x.Date).ThenBy(x => x.Customer.Description).ThenBy(x => x.PickupPoint.Route.IsTransfer)
                .Where(x => x.Date == date && x.CustomerId == 53)
                .AsEnumerable().GroupBy(x => new { x.Date, x.Customer })
                .Select(x => new InvoiceIntermediateViewModel {
                    Date = x.Key.Date,
                    Customer = x.Key.Customer,
                    Reservations = x.ToList(),
                    IsTransferGroup = GetCustomerVessels(x.ToList()),
                    TotalPersons = x.Select(r => r.TotalPersons).Sum()
                }).ToList();
            // return result;
            return mapper.Map<IEnumerable<InvoiceIntermediateViewModel>, IEnumerable<InvoiceViewModel>>(result);
        }

        public List<IsTransferGroupViewModel> GetCustomerVessels(List<Reservation> reservations) {
            var result = reservations
                    .GroupBy(r => r.PickupPoint.Route.IsTransfer)
                    .Select(g => new IsTransferGroupViewModel {
                        IsTransfer = g.Key,
                        TotalPersons = g.Select(r => r.TotalPersons).Sum(),
                    })
                    .ToList();
            return result;
        }

    }

    public class Group {

        public string Customer { get; set; }

        public IEnumerable<Reservation> Records { get; set; }

    }

}