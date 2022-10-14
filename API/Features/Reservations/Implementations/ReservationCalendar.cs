using System;
using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Reservations {

    public class ReservationCalendar : Repository<Reservation>, IReservationCalendar {

        public ReservationCalendar(AppDbContext context, IOptions<TestingEnvironment> testingEnvironment) : base(context, testingEnvironment) { }

        public IEnumerable<ReservationCalendarGroupVM> GetForCalendar(string fromDate, string toDate) {
            return context.Schedules
                .AsNoTracking()
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate))
                .GroupBy(z => z.Date)
                .Select(x => new ReservationCalendarGroupVM {
                    Date = DateHelpers.DateTimeToISOString(x.Key.Date),
                    Destinations = x.GroupBy(x => new { x.Date, x.Destination.Id, x.Destination.Description, x.Destination.Abbreviation }).Select(x => new DestinationCalendarVM {
                        Id = x.Key.Id,
                        Description = x.Key.Description,
                        Abbreviation = x.Key.Abbreviation,
                        Pax = context.Reservations.AsNoTracking().Where(z => z.Date == x.Key.Date && z.Destination.Id == x.Key.Id).Sum(x => x.TotalPersons)
                    }),
                    Pax = context.Reservations.AsNoTracking().Where(z => z.Date == x.Key.Date).Sum(x => x.TotalPersons)
                }).ToList();
        }

    }

}