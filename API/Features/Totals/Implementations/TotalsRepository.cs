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

namespace API.Features.Totals {

    public class TotalsRepository : Repository<TotalsRepository>, ITotalsRepository {

        private readonly IMapper mapper;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly UserManager<UserExtended> userManager;

        public TotalsRepository(IHttpContextAccessor httpContextAccessor, AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings, UserManager<UserExtended> userManager) : base(appDbContext, settings) {
            this.httpContextAccessor = httpContextAccessor;
            this.mapper = mapper;
            this.userManager = userManager;
        }

        public async Task<IEnumerable<TotalsReportVM>> Get(string fromDate, string toDate) {
            var simpleUser = await Identity.GetConnectedUserId(httpContextAccessor);
            var userDetails = Identity.GetConnectedUserDetails(userManager, simpleUser.UserId);
            var records = context.Set<Reservation>()
                 .Include(x => x.Customer)
                 .Include(x => x.Destination)
                 .Include(x => x.PickupPoint).ThenInclude(x => x.CoachRoute)
                 .Include(x => x.Port)
                 .Include(x => x.Ship)
                 .Include(x => x.Passengers)
                 .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate) && x.CustomerId == userDetails.CustomerId)
                 .AsEnumerable()
                 .GroupBy(x => x.Customer).OrderBy(x => x.Key.Description)
                 .Select(x => new TotalsDTO {
                     Date = fromDate + " - " + toDate,
                     Customer = new SimpleResource { Id = x.Key.Id, Description = x.Key.Description },
                     Ports = x.GroupBy(x => x.Port).OrderBy(x => !x.Key.IsPrimary).Select(x => new TotalsPortDTO {
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
            return mapper.Map<IEnumerable<TotalsDTO>, IEnumerable<TotalsReportVM>>(records);
        }

    }

}