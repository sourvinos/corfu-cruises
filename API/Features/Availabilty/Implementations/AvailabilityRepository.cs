using System;
using System.Collections.Generic;
using System.Linq;
using API.Features.Reservations;
using API.Features.Schedules;
using API.Infrastructure.Classes;

namespace API.Features.Availability {

    public class AvailabilityRepository : IAvailabilityRepository {

        private readonly AppDbContext context;

        public AvailabilityRepository(AppDbContext context) {
            this.context = context;
        }

        public IEnumerable<AvailabilityVM> DoCalendarTasks(string fromDate, string toDate) {
            var schedules = GetScheduleForPeriod(fromDate, toDate);
            var reservations = GetReservationsForPeriod(fromDate, toDate);
            return UpdateCalendarData(schedules, reservations);
        }

        private IEnumerable<ScheduleViewModel> GetScheduleForPeriod(string fromDate, string toDate) {
            var response = context.Set<Schedule>()
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate) && x.IsActive && x.Destination.IsActive)
                .OrderBy(x => x.Date).ThenBy(x => x.DestinationId).ThenBy(x => x.PortId)
                .Select(x => new ScheduleViewModel {
                    Date = x.Date.ToString(),
                    DestinationId = x.DestinationId,
                    DestinationDescription = x.Destination.Description,
                    DestinationAbbreviation = x.Destination.Abbreviation,
                    PortId = x.PortId,
                    PortAbbreviation = x.Port.Abbreviation,
                    IsPortPrimary = x.Port.IsPrimary,
                    MaxPassengers = x.MaxPassengers
                });
            return response.ToList();
        }

        private IEnumerable<ReservationViewModel> GetReservationsForPeriod(string fromDate, string toDate) {
            var response = context.Set<Reservation>()
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate))
                .OrderBy(x => x.Date).ThenBy(x => x.DestinationId).ThenBy(x => x.PortId)
                .GroupBy(x => new { x.Date, x.DestinationId, x.PortId })
                .Select(x => new ReservationViewModel {
                    Date = x.Key.Date.ToString(),
                    DestinationId = x.Key.DestinationId,
                    PortId = x.Key.PortId,
                    TotalPersons = x.Sum(x => x.TotalPersons)
                });
            return response.ToList();
        }

        private static IEnumerable<AvailabilityVM> UpdateCalendarData(IEnumerable<ScheduleViewModel> schedule, IEnumerable<ReservationViewModel> reservations) {
            foreach (var item in schedule) {
                var x = reservations.FirstOrDefault(x => x.Date == item.Date && x.DestinationId == item.DestinationId && x.PortId == item.PortId);
                item.Passengers = (x?.TotalPersons) ?? 0;
            }
            var response = schedule
                .GroupBy(x => x.Date)
                .Select(x => new AvailabilityVM {
                    Date = x.Key,
                    Destinations = x.GroupBy(x => new { x.Date, x.DestinationId, x.DestinationDescription })
                    .Select(x => new DestinationPortsVM {
                        Id = x.Key.DestinationId,
                        Description = x.Key.DestinationDescription,
                        PassengerCount = CalculatePassengerCountForDestination(reservations, x.Key.Date, x.Key.DestinationId),
                        AvailableSeats = CalculateAvailableSeatsForAllPorts(schedule, reservations, x.Key.Date, x.Key.DestinationId),
                        Ports = x.GroupBy(x => new { x.PortId, x.Date, x.DestinationId, x.PortAbbreviation, x.IsPortPrimary, x.MaxPassengers })
                        .Select(x => new PortVM {
                            Id = x.Key.PortId,
                            Abbreviation = x.Key.PortAbbreviation,
                            IsPrimary = x.Key.IsPortPrimary,
                            MaxPassengers = x.Key.MaxPassengers,
                            PassengerCount = x.Sum(x => x.Passengers),
                            AvailableSeats = CalculateAvailableSeatsForPort(schedule, x.Key.Date, x.Key.DestinationId, x.Key.MaxPassengers, x.Sum(x => x.Passengers), x.Key.IsPortPrimary)
                        })
                    })
                });
            return response.ToList();
        }

        private static int CalculateAvailableSeatsForAllPorts(IEnumerable<ScheduleViewModel> schedule, IEnumerable<ReservationViewModel> reservations, string date, int destinationId) {
            var maxPassengers = CalculateMaxPassengers(schedule, date, destinationId);
            var passengers = CalculatePassengerCountForDestination(reservations, date, destinationId);
            return maxPassengers - passengers;
        }

        private static int CalculateAvailableSeatsForPort(IEnumerable<ScheduleViewModel> schedule, string date, int destinationId, int maxPassengers, int passengers, bool isPortPrimary) {
            if (isPortPrimary) {
                return CalculateAvailableSeatsForPrimaryPort(schedule, date, destinationId, maxPassengers, passengers);
            } else {
                return CalculateAvailableSeatsForSecondaryPort(schedule, date, destinationId, maxPassengers, passengers);
            }
        }

        private static int CalculatePassengerCountForDestination(IEnumerable<ReservationViewModel> reservations, string date, int destinationId) {
            return reservations.Where(x => x.Date == date && x.DestinationId == destinationId).Sum(x => x.TotalPersons);
        }

        private static int CalculateMaxPassengers(IEnumerable<ScheduleViewModel> schedule, string date, int destinationId) {
            return schedule.Where(x => x.Date == date && x.DestinationId == destinationId).Sum(x => x.MaxPassengers);
        }

        private static int CalculateAvailableSeatsForPrimaryPort(IEnumerable<ScheduleViewModel> schedule, string date, int destinationId, int maxPassengers, int passengers) {
            var secondaryPort = schedule.FirstOrDefault(x => x.Date == date && x.DestinationId == destinationId && !x.IsPortPrimary);
            if (secondaryPort != null && secondaryPort.MaxPassengers != 0) {
                if (secondaryPort.Passengers > secondaryPort.MaxPassengers) {
                    return maxPassengers - passengers - (secondaryPort.Passengers - secondaryPort.MaxPassengers);
                } else {
                    return maxPassengers - passengers;
                }
            } else {
                return maxPassengers - passengers - ((secondaryPort?.Passengers) ?? 0);
            }
        }

        private static int CalculateAvailableSeatsForSecondaryPort(IEnumerable<ScheduleViewModel> schedule, string date, int destinationId, int maxPassengers, int passengers) {
            var primaryPort = schedule.FirstOrDefault(x => x.Date == date && x.DestinationId == destinationId && x.IsPortPrimary);
            if (primaryPort != null) {
                return primaryPort.MaxPassengers - primaryPort.Passengers + maxPassengers - passengers;
            } else {
                return maxPassengers - passengers;
            }
        }

    }

}