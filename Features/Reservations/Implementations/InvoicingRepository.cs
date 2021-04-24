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

        public List<Reservation> Get(string date) {
            var q = context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route)
                .Include(x => x.Ship)
                .Where(x => x.Date == date && x.CustomerId == 22)
                .OrderBy(x => x.Customer.Description)
                .ToList();
            q.Select(master => new Master {
                Reservations = q,
                Detail = q.Where(x => x.Date == date && x.Customer.Id == 22).GroupBy(x => new {
                    destinationId = x.Destination.Id, destinationDescription = x.Destination.Description,
                    customerId = x.Customer.Id, customerDescription = x.Customer.Description,
                    x.PickupPoint.Route.IsTransfer
                }).Select(x => new Detail {
                    Adults = x.Sum(s => s.Adults),
                    Kids = x.Sum(s => s.Kids),
                    Free = x.Sum(s => s.Free),
                    IsTransfer = x.Key.IsTransfer,
                    TotalPersons = x.Sum(s => s.TotalPersons),
                })
            });
            return q;
        }

    }

}