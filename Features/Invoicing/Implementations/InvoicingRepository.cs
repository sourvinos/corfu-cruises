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
                .OrderBy(x => x.Customer)
                .Where(x => x.Date == date)
                .AsEnumerable().GroupBy(x => x.Customer)
                .Select(x => new InvoiceViewModel {
                    Customer = x.Key.ToString(),
                    Reservations = x.ToList(),
                    VesselReservations = GetCustomerVessels(x.ToList()),
                    Total = x.Select(r => r.TotalPersons).Sum()
                });
            return result;
        }

        public List<ShipViewModel> GetCustomerVessels(List<Reservation> reservations) {
            var result = reservations
                    .GroupBy(r => r.PickupPoint.Route.IsTransfer)
                    .Select(g => new ShipViewModel {
                        Vessel = g.Key.ToString(),
                        Passengers = g.Select(r => r.TotalPersons).Sum(),
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