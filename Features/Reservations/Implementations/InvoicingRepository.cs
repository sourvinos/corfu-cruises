using System;
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

        public List<PersonsPerTransfer> Get(string date) {
            // context.Reservations.Include(x => x.PickupPoint.Route.Port)
            // .Where(x => x.Date == date)
            // .OrderBy(o => o.PickupPoint.Route.Port.Description)
            // .GroupBy(x => new { x.PickupPoint.Route.Port.Description })
            // .Select(x => new PersonsPerPort { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) })
            // .OrderBy(o => o.Description);
            var reservations = context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route)
                .Include(x => x.Ship)
                .Where(x => x.Date == date && x.CustomerId == x.CustomerId)
                .GroupBy(x => new {
                    destinationId = x.Destination.Id, destinationDescription = x.Destination.Description,
                    customerId = x.Customer.Id, customerDescription = x.Customer.Description,
                    x.PickupPoint.Route.IsTransfer
                })
                .Select(x => new PersonsPerTransfer {
                    Destination = new DestinationResource { Id = x.Key.destinationId, Description = x.Key.destinationDescription },
                    Customer = new CustomerResource { Id = x.Key.customerId, Description = x.Key.customerDescription },
                    Adults = x.Sum(s => s.Adults),
                    Kids = x.Sum(s => s.Kids),
                    Free = x.Sum(s => s.Free),
                    IsTransfer = x.Key.IsTransfer,
                    TotalPersons = x.Sum(s => s.TotalPersons),
                })
                .OrderBy(x => x.Customer.Id).ThenBy(x => x.IsTransfer)
                .ToList();
            return reservations;
        }

        private List<string> GetTickets() {
            return new List<string>();
        }

    }

}