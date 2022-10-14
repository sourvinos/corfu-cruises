using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Identity;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Billing {

    public class BillingRepository : Repository<BillingRepository>, IBillingRepository {

        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMapper mapper;
        private readonly UserManager<UserExtended> userManager;

        public BillingRepository(AppDbContext appDbContext, IHttpContextAccessor httpContextAccessor, IMapper mapper, IOptions<TestingEnvironment> settings, UserManager<UserExtended> userManager) : base(appDbContext, settings) {
            this.httpContextAccessor = httpContextAccessor;
            this.mapper = mapper;
            this.userManager = userManager;
        }

        public async Task<IEnumerable<BillingFinalVM>> Get(string fromDate, string toDate, string customerId, string destinationId, string shipId) {
            customerId = await GetConnectedCustomerIdForConnectedUser(customerId);
            var records = context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.PickupPoint).ThenInclude(x => x.CoachRoute)
                .Include(x => x.Port)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate)
                    && ((customerId == "all") || x.CustomerId == int.Parse(customerId))
                    && ((destinationId == "all") || x.DestinationId == int.Parse(destinationId))
                    && ((shipId == "all") || (x.ShipId == int.Parse(shipId))))
                .AsEnumerable()
                .GroupBy(x => new { x.Customer }).OrderBy(x => x.Key.Customer.Description)
                .Select(x => new BillingIntermediateReportVM {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Customer = new SimpleResource { Id = x.Key.Customer.Id, Description = x.Key.Customer.Description },
                    Ports = x.GroupBy(x => x.Port).OrderBy(x => x.Key.StopOrder).Select(x => new BillingIntermediatePortVM {
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
                    Reservations = x.OrderBy(x => x.Date).ThenBy(x => !x.PickupPoint.CoachRoute.HasTransfer).ToList()
                })
                .ToList();
            return mapper.Map<IEnumerable<BillingIntermediateReportVM>, IEnumerable<BillingFinalVM>>(records);
        }

        private async Task<string> GetConnectedCustomerIdForConnectedUser(string customerId) {
            var isUserAdmin = Identity.IsUserAdmin(httpContextAccessor);
            if (!isUserAdmin) {
                var simpleUser = await Identity.GetConnectedUserId(httpContextAccessor);
                var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, simpleUser);
                return connectedUserDetails.CustomerId.ToString();
            }
            return customerId;
        }

    }

}