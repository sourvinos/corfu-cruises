using System;
using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.Classes;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Reservations {

    public class ReservationAvailability : IReservationAvailability {

        private readonly AppDbContext context;

        public ReservationAvailability(AppDbContext context) {
            this.context = context;
        }

        public IList<ReservationAvailabilityVM> CalculateAvailability(string date, int destinationId, int portId) {
            return CalculateFreeSeats(CalculateAccumulatedPax(GetReservations(GetSchedule(date, destinationId, GetPortStopOrder(portId)))));
        }

        private int GetPortStopOrder(int portId) {
            return context.Ports.Where(x => x.Id == portId).AsNoTracking().Single().StopOrder;
        }

        private IList<ReservationAvailabilityVM> GetSchedule(string date, int destinationid, int portStopOrder) {
            var response = context.Schedules
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationid && x.Port.StopOrder <= portStopOrder)
                .OrderBy(x => x.Date).ThenBy(x => x.DestinationId).ThenBy(x => x.Port.StopOrder)
                .Select(x => new ReservationAvailabilityVM {
                    Date = x.Date.ToString(),
                    DestinationId = x.DestinationId,
                    DestinationDescription = x.Destination.Description,
                    DestinationAbbreviation = x.Destination.Abbreviation,
                    PortId = x.PortId,
                    PortAbbreviation = x.Port.Abbreviation,
                    PortStopOrder = x.Port.StopOrder,
                    MaxPax = x.MaxPassengers
                });
            return response.ToList();
        }

        private IList<ReservationAvailabilityVM> GetReservations(IList<ReservationAvailabilityVM> schedules) {
            foreach (var schedule in schedules) {
                var passengers = context.Reservations.Where(x => x.Date == Convert.ToDateTime(schedule.Date) && x.DestinationId == schedule.DestinationId && x.PortId == schedule.PortId).Sum(x => x.TotalPersons);
                schedule.Pax = passengers;
            }
            return schedules;
        }

        private static IList<ReservationAvailabilityVM> CalculateAccumulatedPax(IList<ReservationAvailabilityVM> schedules) {
            if (schedules.Count > 0) {
                var initialSchedule = schedules.First();
                string date = initialSchedule.Date;
                int destinationId = initialSchedule.DestinationId;
                for (int i = 0; i < schedules.Count; i++) {
                    if (i == 0) {
                        schedules[i].AccumulatedPax = schedules[i].Pax;
                    } else {
                        if (date == schedules[i].Date && destinationId == schedules[i].DestinationId) {
                            schedules[i].AccumulatedPax += schedules[i - 1].AccumulatedPax + schedules[i].Pax;
                        } else {
                            date = schedules[i].Date;
                            destinationId = schedules[i].DestinationId;
                            schedules[i].AccumulatedPax = schedules[i].Pax;
                        }
                    }
                }
            }
            return schedules;
        }

        private static IList<ReservationAvailabilityVM> CalculateFreeSeats(IList<ReservationAvailabilityVM> schedules) {
            foreach (var schedule in schedules) {
                schedule.FreeSeats = schedule.MaxPax - schedule.AccumulatedPax;
            }
            return schedules;
        }

    }

}