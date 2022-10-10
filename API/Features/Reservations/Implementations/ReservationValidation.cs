using System;
using System.Linq;
using System.Threading.Tasks;
using API.Features.PickupPoints;
using API.Features.Schedules;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Identity;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Reservations {

    public class ReservationValidation : Repository<Reservation>, IReservationValidation {

        private readonly IHttpContextAccessor httpContext;
        private readonly IReservationAvailability reservationAvailability;
        private readonly TestingEnvironment testingEnvironment;
        private readonly UserManager<UserExtended> userManager;

        public ReservationValidation(AppDbContext context, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> testingEnvironment, IReservationAvailability reservationAvailability, UserManager<UserExtended> userManager) : base(context, testingEnvironment) {
            this.httpContext = httpContext;
            this.reservationAvailability = reservationAvailability;
            this.testingEnvironment = testingEnvironment.Value;
            this.userManager = userManager;
        }

        public async Task<bool> IsUserOwner(int customerId) {
            var userId = await Identity.GetConnectedUserId(httpContext);
            var userDetails = Identity.GetConnectedUserDetails(userManager, userId);
            return userDetails.CustomerId == customerId;
        }

        public bool IsKeyUnique(ReservationWriteDto reservation) {
            return !context.Reservations
                .AsNoTracking()
                .Any(x =>
                    x.Date == Convert.ToDateTime(reservation.Date) &&
                    x.ReservationId != reservation.ReservationId &&
                    x.DestinationId == reservation.DestinationId &&
                    x.CustomerId == reservation.CustomerId &&
                    string.Equals(x.TicketNo, reservation.TicketNo, StringComparison.OrdinalIgnoreCase));
        }

        public int GetPortIdFromPickupPointId(ReservationWriteDto reservation) {
            PickupPoint pickupPoint = context.PickupPoints
                .AsNoTracking()
                .Include(x => x.CoachRoute)
                .SingleOrDefault(x => x.Id == reservation.PickupPointId);
            return pickupPoint != null ? pickupPoint.CoachRoute.PortId : 0;
        }

        public bool IsOverbooked(string date, int destinationId) {
            int maxPassengersForAllPorts = context.Schedules
                .AsNoTracking()
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId)
                .Sum(x => x.MaxPax);
            int totalPersonsFromAllPorts = context.Reservations
                .AsNoTracking()
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId)
                .Sum(x => x.TotalPersons);
            return totalPersonsFromAllPorts > maxPassengersForAllPorts;
        }

        public int IsValid(ReservationWriteDto reservation, IScheduleRepository scheduleRepo) {
            return true switch {
                var x when x == !IsKeyUnique(reservation) => 409,
                var x when x == !IsValidCustomer(reservation) => 450,
                var x when x == !IsValidDestination(reservation) => 451,
                var x when x == !IsValidPickupPoint(reservation) => 452,
                var x when x == !IsValidDriver(reservation) => 453,
                var x when x == !IsValidShip(reservation) => 454,
                var x when x == !IsValidNationality(reservation) => 456,
                var x when x == !IsValidGender(reservation) => 457,
                var x when x == !IsValidOccupant(reservation) => 458,
                var x when x == !IsCorrectPassengerCount(reservation) => 455,
                var x when x == !PortHasDepartureForDateAndDestination(reservation) => 410,
                var x when x == SimpleUserCausesOverbooking(reservation.Date, reservation.ReservationId, reservation.DestinationId, GetPortIdFromPickupPointId(reservation), reservation.Adults + reservation.Kids + reservation.Free) => 433,
                var x when x == SimpleUserHasNightRestrictions(reservation) => 459,
                var x when x == SimpleUserCanNotAddReservationAfterDeparture(reservation) => 431,
                _ => 200,
            };
        }

        private bool PortHasDepartureForDateAndDestination(ReservationWriteDto reservation) {
            var schedule = context.Schedules
                .Where(x => x.Date.ToString() == reservation.Date && x.DestinationId == reservation.DestinationId && x.PortId == GetPortIdFromPickupPointId(reservation) && x.IsActive)
                .ToList();
            return schedule.Count != 0;
        }

        private bool SimpleUserCausesOverbooking(string date, Guid? reservationId, int destinationId, int portId, int reservationPersons) {
            if (Identity.IsUserAdmin(httpContext).Result || reservationId != Guid.Empty) {
                return false;
            } else {
                return reservationAvailability.CalculateAvailability(date, destinationId, portId).Last().FreeSeats < reservationPersons;
            }
        }

        private bool SimpleUserCanNotAddReservationAfterDeparture(ReservationWriteDto reservation) {
            return !Identity.IsUserAdmin(httpContext).Result && IsAfterDeparture(reservation);
        }

        private bool IsValidCustomer(ReservationWriteDto reservation) {
            if (reservation.ReservationId == Guid.Empty) {
                return context.Customers.AsNoTracking().SingleOrDefault(x => x.Id == reservation.CustomerId && x.IsActive) != null;
            }
            return context.Customers.AsNoTracking().SingleOrDefault(x => x.Id == reservation.CustomerId) != null;
        }

        private bool IsValidDestination(ReservationWriteDto reservation) {
            if (reservation.ReservationId == Guid.Empty) {
                return context.Destinations.AsNoTracking().SingleOrDefault(x => x.Id == reservation.DestinationId && x.IsActive) != null;
            }
            return context.Destinations.AsNoTracking().SingleOrDefault(x => x.Id == reservation.DestinationId) != null;
        }

        private bool IsValidPickupPoint(ReservationWriteDto reservation) {
            if (reservation.ReservationId == Guid.Empty) {
                return context.PickupPoints.AsNoTracking().SingleOrDefault(x => x.Id == reservation.PickupPointId && x.IsActive) != null;
            }
            return context.PickupPoints.AsNoTracking().SingleOrDefault(x => x.Id == reservation.PickupPointId) != null;
        }

        private bool IsValidDriver(ReservationWriteDto reservation) {
            if (reservation.DriverId != null && reservation.DriverId != 0) {
                if (reservation.ReservationId == Guid.Empty) {
                    var driver = context.Drivers.AsNoTracking().SingleOrDefault(x => x.Id == reservation.DriverId && x.IsActive);
                    if (driver == null)
                        return false;
                } else {
                    var driver = context.Drivers.AsNoTracking().SingleOrDefault(x => x.Id == reservation.DriverId);
                    if (driver == null)
                        return false;
                }
            }
            return true;
        }

        private bool IsValidShip(ReservationWriteDto reservation) {
            if (reservation.ShipId != null && reservation.ShipId != 0) {
                if (reservation.ReservationId == Guid.Empty) {
                    var ship = context.Ships.AsNoTracking().SingleOrDefault(x => x.Id == reservation.ShipId && x.IsActive);
                    if (ship == null)
                        return false;
                } else {
                    var ship = context.Ships.AsNoTracking().SingleOrDefault(x => x.Id == reservation.ShipId);
                    if (ship == null)
                        return false;
                }
            }
            return true;
        }

        private static bool IsCorrectPassengerCount(ReservationWriteDto reservation) {
            if (reservation.Passengers != null) {
                if (reservation.Passengers.Count != 0) {
                    return reservation.Passengers.Count <= reservation.Adults + reservation.Kids + reservation.Free;
                }
            }
            return true;
        }

        private bool IsValidNationality(ReservationWriteDto reservation) {
            if (reservation.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in reservation.Passengers) {
                    if (reservation.ReservationId == Guid.Empty) {
                        isValid = context.Nationalities.AsNoTracking().SingleOrDefault(x => x.Id == passenger.NationalityId && x.IsActive) != null;
                    } else {
                        isValid = context.Nationalities.AsNoTracking().SingleOrDefault(x => x.Id == passenger.NationalityId) != null;
                    }
                }
                return reservation.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidGender(ReservationWriteDto reservation) {
            if (reservation.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in reservation.Passengers) {
                    if (reservation.ReservationId == Guid.Empty) {
                        isValid = context.Genders.AsNoTracking().SingleOrDefault(x => x.Id == passenger.GenderId && x.IsActive) != null;
                    } else {
                        isValid = context.Genders.AsNoTracking().SingleOrDefault(x => x.Id == passenger.GenderId) != null;
                    }
                }
                return reservation.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidOccupant(ReservationWriteDto reservation) {
            if (reservation.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in reservation.Passengers) {
                    if (reservation.ReservationId == Guid.Empty) {
                        isValid = context.Occupants.AsNoTracking().SingleOrDefault(x => x.Id == passenger.OccupantId && x.IsActive) != null;
                    } else {
                        isValid = context.Occupants.AsNoTracking().SingleOrDefault(x => x.Id == passenger.OccupantId) != null;
                    }
                }
                return reservation.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private bool SimpleUserHasNightRestrictions(ReservationWriteDto reservation) {
            if (!Identity.IsUserAdmin(httpContext).Result && reservation.ReservationId == Guid.Empty) {
                if (HasTransfer(reservation.PickupPointId)) {
                    if (IsForTomorrow(reservation)) {
                        if (IsBetweenClosingTimeAndMidnight(reservation)) {
                            return true;
                        }
                    }
                    if (IsForToday(reservation)) {
                        if (IsBetweenMidnightAndDeparture(reservation)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        private bool HasTransfer(int pickupPointId) {
            var pickupPoint = context.PickupPoints
                .AsNoTracking()
                .Include(x => x.CoachRoute)
                .AsNoTracking()
                .SingleOrDefault(x => x.Id == pickupPointId);
            return pickupPoint.CoachRoute.HasTransfer;
        }

        private bool IsForTomorrow(ReservationWriteDto reservation) {
            var tomorrow = testingEnvironment.IsTesting ? reservation.TestDateNow.AddDays(1) : DateHelpers.GetLocalDateTime().AddDays(1);
            var tomorrowDate = DateHelpers.DateTimeToISOString(tomorrow);
            return reservation.Date == tomorrowDate;
        }

        private bool IsForToday(ReservationWriteDto reservation) {
            var today = testingEnvironment.IsTesting ? reservation.TestDateNow : DateHelpers.GetLocalDateTime();
            var todayDate = DateHelpers.DateTimeToISOString(today);
            return reservation.Date == todayDate;
        }

        private bool IsBetweenClosingTimeAndMidnight(ReservationWriteDto reservation) {
            var timeNow = testingEnvironment.IsTesting ? reservation.TestDateNow.TimeOfDay : DateHelpers.GetLocalDateTime().TimeOfDay;
            return timeNow.Hours >= 22;
        }

        private bool IsBetweenMidnightAndDeparture(ReservationWriteDto reservation) {
            var timeNow = testingEnvironment.IsTesting ? reservation.TestDateNow : DateHelpers.GetLocalDateTime();
            var departureTime = GetScheduleDepartureTime(reservation);
            return DateTime.Compare(timeNow, departureTime) < 0;
        }

        private bool IsAfterDeparture(ReservationWriteDto reservation) {
            var timeNow = testingEnvironment.IsTesting ? reservation.TestDateNow : DateHelpers.GetLocalDateTime();
            var departureTime = GetScheduleDepartureTime(reservation);
            return DateTime.Compare(timeNow, departureTime) > 0;
        }

        private DateTime GetScheduleDepartureTime(ReservationWriteDto reservation) {
            var portId = GetPortIdFromPickupPointId(reservation).ToString();
            var schedule = context.Schedules
                .AsNoTracking()
                .Where(x => x.Date.ToString() == reservation.Date && x.DestinationId == reservation.DestinationId && x.PortId.ToString() == portId)
                .SingleOrDefault();
            var departureTime = schedule.Date.ToString("yyyy-MM-dd") + " " + schedule.DepartureTime;
            var departureTimeAsDate = DateTime.Parse(departureTime);
            return departureTimeAsDate;
        }

    }

}