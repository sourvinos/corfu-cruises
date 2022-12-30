using System;
using System.Collections.Generic;
using System.Linq;
using API.Features.Users;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Ledger {

    public class LedgerRepository : Repository<LedgerRepository>, ILedgerRepository {

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;
        private readonly UserManager<UserExtended> userManager;

        public LedgerRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings, UserManager<UserExtended> userManager) : base(appDbContext, httpContext, settings) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.userManager = userManager;
        }

        public IEnumerable<LedgerFinalVM> Get(string fromDate, string toDate, int[] customerIds, int[] destinationIds, int?[] shipIds) {
            customerIds = GetConnectedCustomerIdForConnectedUser(customerIds);
            var records = context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.PickupPoint).ThenInclude(x => x.CoachRoute)
                .Include(x => x.Port)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.Date >= Convert.ToDateTime(fromDate)
                    && x.Date <= Convert.ToDateTime(toDate)
                    && customerIds.Contains(x.CustomerId)
                    && destinationIds.Contains(x.DestinationId)
                    && shipIds.Contains(x.ShipId))
                .AsEnumerable()
                .GroupBy(x => new { x.Customer }).OrderBy(x => x.Key.Customer.Description)
                .Select(x => new LedgerInitialVM {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Customer = new SimpleEntity {
                        Id = x.Key.Customer.Id,
                        Description = x.Key.Customer.Description
                    },
                    Ports = x.GroupBy(x => x.Port).OrderBy(x => x.Key.StopOrder).Select(x => new LedgerInitialPortVM {
                        Port = x.Key.Description,
                        HasTransferGroup = x.GroupBy(x => x.PickupPoint.CoachRoute.HasTransfer).Select(x => new LedgerInitialPortGroupVM {
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
                    Reservations = x.OrderBy(x => x.Date).ThenBy(x => !x.PickupPoint.CoachRoute.HasTransfer).ToList()
                })
                .ToList();
            return mapper.Map<IEnumerable<LedgerInitialVM>, IEnumerable<LedgerFinalVM>>(records);
        }

        private int[] GetConnectedCustomerIdForConnectedUser(int[] customerIds) {
            var isUserAdmin = Identity.IsUserAdmin(httpContext);
            if (!isUserAdmin) {
                var simpleUser = Identity.GetConnectedUserId(httpContext);
                var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, simpleUser);
                int[] x = new int[1];
                x[0] = (int)connectedUserDetails.CustomerId;
                return x;
            }
            return customerIds;
        }

    }

}