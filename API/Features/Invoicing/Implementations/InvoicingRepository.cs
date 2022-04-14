using System;
using System.Collections.Generic;
using System.Linq;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Invoicing {

    public class InvoicingRepository : Repository<InvoicingRepository>, IInvoicingRepository {

        private readonly IMapper mapper;

        public InvoicingRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public IEnumerable<InvoiceIntermediateVM> Get(string date, string customerId, string destinationId, string shipId) {
            var result = context.Set<Reservation>()
                .Include(x => x.Customer)
                .Include(x => x.Port)
                .Include(x => x.Ship)
                .Include(x => x.PickupPoint).ThenInclude(x => x.CoachRoute)
                .Where(x => x.Date == Convert.ToDateTime(date)
                    && ((customerId == "all") || x.CustomerId == int.Parse(customerId))
                    && ((destinationId == "all") || x.DestinationId == int.Parse(destinationId))
                    && ((shipId == "all") || x.ShipId == int.Parse(shipId)))
                .AsEnumerable()
                .GroupBy(x => x.Port)
                .Select(x => new InvoiceIntermediateVM {
                    Port = x.Key.Description,
                    PortTotal = x.Sum(x => x.TotalPersons),
                    TransferGroup = x.GroupBy(x => x.PickupPoint.CoachRoute.HasTransfer).Select(x => new TransferGroup {
                        HasTransfer = x.Key,
                        Passengers = x.Sum(x => x.TotalPersons),
                    }),
                    Reservations = x.ToList()
                }).ToList();
            return result;
        }

        public static List<InvoicePortVM> GroupReservationsByPort(List<Reservation> reservations) {
            return reservations
                .GroupBy(x => x.Port.Description)
                .Select(x => new InvoicePortVM {
                    PortDescription = x.Key
                })
                .ToList();
        }

        public static List<HasTransferGroupVM> GroupReservationsByHasTransfer(List<Reservation> reservations) {
            return reservations
                .GroupBy(r => r.PickupPoint.CoachRoute.HasTransfer)
                .Select(g => new HasTransferGroupVM {
                    HasTransfer = g.Key,
                    Adults = g.Select(r => r.Adults).Sum(),
                    Kids = g.Select(r => r.Kids).Sum(),
                    Free = g.Select(r => r.Free).Sum(),
                    TotalPersons = g.Select(r => r.TotalPersons).Sum(),
                })
                .ToList();
        }

    }

}