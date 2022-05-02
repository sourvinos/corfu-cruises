using System;
using System.Collections.Generic;
using System.Linq;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Invoicing.Display {

    public class InvoicingDisplayRepository : Repository<InvoicingDisplayRepository>, IInvoicingDisplayRepository {

        private readonly IMapper mapper;

        public InvoicingDisplayRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public IEnumerable<InvoicingDisplayReportVM> Get(string date, string customerId, string destinationId, string shipId) {
            var records = context.Set<Reservation>()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.PickupPoint).ThenInclude(x => x.CoachRoute)
                .Include(x => x.Port)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.Date == Convert.ToDateTime(date)
                    && ((customerId == "all") || x.CustomerId == int.Parse(customerId))
                    && ((destinationId == "all") || x.DestinationId == int.Parse(destinationId))
                    && ((shipId == "all") || (x.ShipId == int.Parse(shipId))))
                .AsEnumerable()
                .GroupBy(x => x.Customer).OrderBy(x => x.Key.Description)
                .Select(x => new InvoicingDisplayDTO {
                    Date = date,
                    Customer = new SimpleResource { Id = x.Key.Id, Description = x.Key.Description },
                    Ports = x.GroupBy(x => x.Port).OrderBy(x => !x.Key.IsPrimary).Select(x => new InvoicingDisplayPortDTO {
                        Port = x.Key.Description,
                        HasTransferGroup = x.GroupBy(x => x.PickupPoint.CoachRoute.HasTransfer).Select(x => new HasTransferGroupDTO {
                            HasTransfer = x.Key,
                            Adults = x.Sum(x => x.Adults),
                            Kids = x.Sum(x => x.Kids),
                            Free = x.Sum(x => x.Free),
                            TotalPersons = x.Sum(x => x.TotalPersons),
                            TotalPassengers = x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn))
                        }).OrderBy(x => !x.HasTransfer),
                        Adults = x.Sum(x => x.Adults),
                        Kids = x.Sum(x => x.Kids),
                        Free = x.Sum(x => x.Free),
                        TotalPersons = x.Sum(x => x.TotalPersons),
                        TotalPassengers = x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn))
                    }),
                    Adults = x.Sum(x => x.Adults),
                    Kids = x.Sum(x => x.Kids),
                    Free = x.Sum(x => x.Free),
                    TotalPersons = x.Sum(x => x.TotalPersons),
                    Reservations = x.OrderBy(x => !x.PickupPoint.CoachRoute.HasTransfer).ToList()
                }).ToList();
            return mapper.Map<IEnumerable<InvoicingDisplayDTO>, IEnumerable<InvoicingDisplayReportVM>>(records);
        }

    }

}