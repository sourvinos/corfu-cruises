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

        /// <summary>
        ///     Creates an array of ReservationCalendarGroupVM objects. It iterates the period array.
        ///     Each object contains:
        ///         Date: The date taken from the schedules table.
        ///         Destinations: An array of DestinationCalendarVM objects taken from the schedules table.
        ///         Pax: The sum of persons for the date and destination taken from the reservatoins table.
        /// </summary>
        /// <param name="fromDate"></param>
        /// <param name="toDate"></param>
        /// <returns>
        ///     An array of ReservationCalendarGroupVM objects, one object for each day.
        /// </returns>
        public async Task<IEnumerable<ReservationCalendarGroupVM>> GetForCalendarAsync(string fromDate, string toDate) {
            var schedules = new List<ReservationCalendarGroupVM>();
            foreach (var date in BuildPeriod(fromDate, toDate)) {
                var x = await context.Schedules
                    .AsNoTracking()
                    .Where(x => x.Date == Convert.ToDateTime(date))
                    .GroupBy(z => new { z.Date })
                    .Select(x => new ReservationCalendarGroupVM {
                        Date = date,
                        Destinations = x.GroupBy(v => new { v.Destination.Id, v.Destination.Abbreviation, v.Destination.Description }).Select(x => new DestinationCalendarVM {
                            Id = x.Key.Id,
                            Abbreviation = x.Key.Abbreviation,
                            Description = x.Key.Description,
                            Pax = context.Reservations.Where(z => z.Date == Convert.ToDateTime(date) && z.DestinationId == x.Key.Id).Sum(x => x.TotalPersons)
                        }),
                        Pax = context.Reservations.Where(z => z.Date == x.Key.Date).Sum(x => x.TotalPersons)
                    }).FirstOrDefaultAsync();
                schedules.Add(x);
            }
            return schedules;
        }

        /// <summary>
        ///     Builds an array of strings containing the dates between the beginning and the end of the period
        /// </summary>
        /// <param name="fromDate"></param>
        /// <param name="toDate"></param>
        /// <returns>
        ///     An array of strings
        /// </returns>
        private static string[] BuildPeriod(string fromDate, string toDate) {
            var days = (DateTime.Parse(toDate) - DateTime.Parse(fromDate)).TotalDays + 1;
            var period = new string[(int)days];
            for (int i = 0; i < days; i++) {
                period[i] = DateHelpers.DateToISOString(DateTime.Parse(fromDate).AddDays(i));
            }
            return period;
        }

    }

}