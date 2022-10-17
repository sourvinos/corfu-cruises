using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace API.Features.Reservations {

    public class ReservationCalendar : Repository<Reservation>, IReservationCalendar {

        public ReservationCalendar(AppDbContext context, IHttpContextAccessor httpContext, ILogger<Reservation> logger, IOptions<TestingEnvironment> testingEnvironment) : base(context, httpContext, logger, testingEnvironment) { }

        public async Task<IEnumerable<ReservationCalendarGroupVM>> GetForCalendarAsync(string fromDate, string toDate) {
            return await context.Schedules
                .AsNoTracking()
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate))
                .GroupBy(z => z.Date)
                .Select(x => new ReservationCalendarGroupVM {
                    Date = DateHelpers.DateToISOString(x.Key.Date),
                    Destinations = x.GroupBy(x => new { x.Date, x.Destination.Id, x.Destination.Description, x.Destination.Abbreviation }).Select(x => new DestinationCalendarVM {
                        Id = x.Key.Id,
                        Description = x.Key.Description,
                        Abbreviation = x.Key.Abbreviation,
                        Pax = context.Reservations.AsNoTracking().Where(z => z.Date == x.Key.Date && z.Destination.Id == x.Key.Id).Sum(x => x.TotalPersons)
                    }),
                    Pax = context.Reservations.AsNoTracking().Where(z => z.Date == x.Key.Date).Sum(x => x.TotalPersons)
                }).ToListAsync();
        }

    }

}