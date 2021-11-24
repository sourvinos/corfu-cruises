using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using BlueWaterCruises.Features.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BlueWaterCruises.Features.Invoicing {

    public class InvoicingRepository : Repository<InvoicingRepository>, IInvoicingRepository {

        private readonly IMapper mapper;

        public InvoicingRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public IEnumerable<InvoiceViewModel> Get(string date, string customerId, string destinationId, string vesselId) {
            var result = context.Set<Reservation>()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Ship)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route)
                .OrderBy(x => x.Date).ThenBy(x => x.Customer.Description).ThenBy(x => !x.PickupPoint.Route.IsTransfer)
                .Where(x => x.Date == Convert.ToDateTime(date)
                    && ((customerId != "all") ? x.CustomerId == Int32.Parse(customerId) : true)
                    && ((destinationId != "all") ? x.DestinationId == Int32.Parse(destinationId) : true)
                    && ((vesselId != "all") ? x.ShipId == Int32.Parse(vesselId) : true))
                .AsEnumerable()
                .GroupBy(x => new { x.Date, x.Customer })
                .Select(x => new InvoiceIntermediateViewModel {
                    Date = Convert.ToDateTime(x.Key.Date),
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