using System;
using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace API.Features.Schedules {

    public class ScheduleCalendar : Repository<Schedule>, IScheduleCalendar {

        public ScheduleCalendar(AppDbContext context, IHttpContextAccessor httpContext, ILogger<Schedule> logger, IOptions<TestingEnvironment> settings) : base(context, httpContext, logger, settings) { }

        public IEnumerable<AvailabilityCalendarGroupVM> GetForCalendar(string fromDate, string toDate) {
            return context.Schedules
                .AsNoTracking()
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate))
                .GroupBy(x => x.Date)
                .Select(x => new AvailabilityCalendarGroupVM {
                    Date = DateHelpers.DateToISOString(x.Key.Date),
                    Destinations = x.GroupBy(x => new { x.Date, x.Destination.Id, x.Destination.Description, x.Destination.Abbreviation }).Select(x => new DestinationCalendarVM {
                        Id = x.Key.Id,
                        Description = x.Key.Description,
                        Abbreviation = x.Key.Abbreviation,
                        Ports = x.GroupBy(x => new { x.PortId, x.Port.Description, x.Port.Abbreviation, x.MaxPax, x.Port.StopOrder }).OrderBy(x => x.Key.StopOrder).Select(x => new PortCalendarVM {
                            Id = x.Key.PortId,
                            Description = x.Key.Description,
                            MaxPax = x.Key.MaxPax,
                        })
                    })
                }).ToList();
        }

        public IEnumerable<AvailabilityCalendarGroupVM> CalculateAccumulatedMaxPaxPerPort(IEnumerable<AvailabilityCalendarGroupVM> schedules) {
            var accumulatedMaxPax = 0;
            foreach (var schedule in schedules) {
                foreach (var destination in schedule.Destinations) {
                    foreach (var port in destination.Ports) {
                        accumulatedMaxPax += port.MaxPax;
                        port.AccumulatedMaxPax = accumulatedMaxPax;
                    }
                    accumulatedMaxPax = 0;
                }
            }
            return schedules;
        }

        public IEnumerable<AvailabilityCalendarGroupVM> GetPaxPerPort(IEnumerable<AvailabilityCalendarGroupVM> schedules) {
            foreach (var schedule in schedules) {
                foreach (var destination in schedule.Destinations) {
                    foreach (var port in destination.Ports) {
                        port.Pax = context.Reservations
                            .AsNoTracking()
                            .Where(x => x.Date == Convert.ToDateTime(schedule.Date) && x.DestinationId == destination.Id && x.PortId == port.Id)
                            .Sum(x => x.TotalPersons);
                    }
                }
            }
            return schedules;
        }

        public IEnumerable<AvailabilityCalendarGroupVM> CalculateAccumulatedPaxPerPort(IEnumerable<AvailabilityCalendarGroupVM> schedules) {
            var accumulatedPax = 0;
            foreach (var schedule in schedules) {
                foreach (var destination in schedule.Destinations) {
                    foreach (var port in destination.Ports) {
                        accumulatedPax += port.Pax;
                        port.AccumulatedPax = accumulatedPax;
                    }
                    accumulatedPax = 0;
                }
            }
            return schedules;
        }

    }

}