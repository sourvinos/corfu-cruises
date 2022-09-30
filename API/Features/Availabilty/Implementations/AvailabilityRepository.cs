using System;
using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.Classes;

namespace API.Features.Availability {

    public class AvailabilityRepository : IAvailabilityRepository {

        private readonly AppDbContext context;

        public AvailabilityRepository(AppDbContext context) {
            this.context = context;
        }

        public IList<ScheduleVM> CalculateFreeSeats(string fromDate, string toDate) {
            var schedules = GetSchedule(fromDate, toDate);
            return CalculateAccumulatedMaxPassengers(schedules);
        }

        private IList<ScheduleVM> GetSchedule(string fromDate, string toDate) {
            var response = context.Schedules
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate))
                .OrderBy(x => x.Date).ThenBy(x => x.DestinationId).ThenBy(x => x.Port.StopOrder)
                .Select(x => new ScheduleVM {
                    Date = x.Date.ToString(),
                    DestinationId = x.DestinationId,
                    DestinationDescription = x.Destination.Description,
                    DestinationAbbreviation = x.Destination.Abbreviation,
                    PortId = x.PortId,
                    PortAbbreviation = x.Port.Abbreviation,
                    PortStopOrder = x.Port.StopOrder,
                    MaxPassengers = x.MaxPassengers
                });
            return response.ToList();
        }

        private static IList<ScheduleVM> CalculateAccumulatedMaxPassengers(IList<ScheduleVM> schedules) {
            if (schedules.Count > 0) {
                var initialSchedule = schedules.First();
                string date = initialSchedule.Date;
                int destinationId = initialSchedule.DestinationId;
                int accumulatedMaxPassengers = 0;
                for (int i = 0; i < schedules.Count; i++) {
                    if (i == 0) {
                        schedules[i].AccumulatedMaxPassengers = schedules[i].MaxPassengers;
                        accumulatedMaxPassengers = schedules[i].MaxPassengers;
                    } else {
                        if (date == schedules[i].Date && destinationId == schedules[i].DestinationId) {
                            if (schedules[i].MaxPassengers == accumulatedMaxPassengers) {
                                schedules[i].AccumulatedMaxPassengers = accumulatedMaxPassengers;
                            } else {
                                schedules[i].AccumulatedMaxPassengers = schedules[i].MaxPassengers;
                            }
                        } else {
                            date = schedules[i].Date;
                            destinationId = schedules[i].DestinationId;
                            schedules[i].AccumulatedMaxPassengers = schedules[i].MaxPassengers;
                        }
                    }
                }
            }
            return schedules;
        }

    }

}