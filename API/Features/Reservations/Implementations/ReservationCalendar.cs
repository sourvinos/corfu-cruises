using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Reservations {

    public class ReservationCalendar : Repository<Reservation>, IReservationCalendar {

        public ReservationCalendar(AppDbContext context, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> testingEnvironment) : base(context, httpContext, testingEnvironment) { }

        public async Task<IEnumerable<ReservationCalendarGroupVM>> GetForCalendarAsync(string fromDate, string toDate) {
            return await context.Schedules
                .AsNoTracking()
                .Include(x => x.Reservations)
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate))
                .GroupBy(z => new { z.Date })
                .Select(x => new ReservationCalendarGroupVM {
                    Date = DateHelpers.DateToISOString(x.Key.Date),
                    Destinations = x.GroupBy(v => new { v.Date, v.Destination.Id, v.Destination.Abbreviation, v.Destination.Description }).Select(x => new DestinationCalendarVM {
                        Id = x.Key.Id,
                        Abbreviation = x.Key.Abbreviation,
                        Description = x.Key.Description,
                        Pax = 0
                    }),
                    Pax = 0
                }).ToListAsync();
        }

    }

}