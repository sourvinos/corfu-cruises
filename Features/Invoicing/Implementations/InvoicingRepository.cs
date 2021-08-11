using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ShipCruises.Features.Reservations;

namespace ShipCruises {

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
                .OrderBy(x => x.Date).ThenBy(x => x.Customer.Description).ThenBy(x => !x.PickupPoint.Route.IsTransfer)
                .Where(x => x.Date == date)
                .AsEnumerable().GroupBy(x => new { x.Date, x.Customer })
                .Select(x => new InvoiceIntermediateViewModel {
                    Date = x.Key.Date,
                    Customer = x.Key.Customer,
                    Reservations = x.ToList(),
                    IsTransferGroup = GroupReservationsByIsTransfer(x.ToList()),
                    IsTransferGroupTotal = new IsTransferGroupViewModel {
                        Adults = x.Select(r => r.Adults).Sum(),
                        Kids = x.Select(r => r.Kids).Sum(),
                        Free = x.Select(r => r.Free).Sum(),
                        TotalPersons = x.Select(r => r.TotalPersons).Sum()
                    }
                }).ToList();
            return mapper.Map<IEnumerable<InvoiceIntermediateViewModel>, IEnumerable<InvoiceViewModel>>(result);
        }

        public IEnumerable<InvoiceViewModel> GetByDateAndCustomer(string date, int customerId) {
            var result = context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Ship)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route)
                .OrderBy(x => x.Date).ThenBy(x => x.Customer.Description).ThenBy(x => !x.PickupPoint.Route.IsTransfer)
                .Where(x => x.Date == date && x.CustomerId == customerId)
                .AsEnumerable().GroupBy(x => new { x.Date, x.Customer })
                .Select(x => new InvoiceIntermediateViewModel {
                    Date = x.Key.Date,
                    Customer = x.Key.Customer,
                    Reservations = x.ToList(),
                    IsTransferGroup = GroupReservationsByIsTransfer(x.ToList()),
                    IsTransferGroupTotal = new IsTransferGroupViewModel {
                        Adults = x.Select(r => r.Adults).Sum(),
                        Kids = x.Select(r => r.Kids).Sum(),
                        Free = x.Select(r => r.Free).Sum(),
                        TotalPersons = x.Select(r => r.TotalPersons).Sum()
                    }
                }).ToList();
            return mapper.Map<IEnumerable<InvoiceIntermediateViewModel>, IEnumerable<InvoiceViewModel>>(result);
        }

        public List<IsTransferGroupViewModel> GroupReservationsByIsTransfer(List<Reservation> reservations) {
            var result = reservations
                    .GroupBy(r => r.PickupPoint.Route.IsTransfer)
                    .Select(g => new IsTransferGroupViewModel {
                        IsTransfer = g.Key,
                        Adults = g.Select(r => r.Adults).Sum(),
                        Kids = g.Select(r => r.Kids).Sum(),
                        Free = g.Select(r => r.Free).Sum(),
                        TotalPersons = g.Select(r => r.TotalPersons).Sum(),
                    })
                    .ToList();
            return result;
        }

    }

}