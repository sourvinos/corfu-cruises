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
            var user = await Identity.GetConnectedUserId(httpContext);
            var userDetails = Identity.GetConnectedUserDetails(userManager, user.UserId);
            return userDetails.CustomerId == customerId;
        }

        public bool IsKeyUnique(ReservationWriteDto record) {
            return !context.Reservations
                .AsNoTracking()
                .Any(x =>
                    x.Date == Convert.ToDateTime(record.Date) &&
                    x.ReservationId != record.ReservationId &&
                    x.DestinationId == record.DestinationId &&
                    x.CustomerId == record.CustomerId &&
                    string.Equals(x.TicketNo, record.TicketNo, StringComparison.OrdinalIgnoreCase));
        }

        public int GetPortIdFromPickupPointId(ReservationWriteDto record) {
            PickupPoint pickupPoint = context.PickupPoints
                .AsNoTracking()
                .Include(x => x.CoachRoute)
                .SingleOrDefault(x => x.Id == record.PickupPointId);
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

        public int IsValid(ReservationWriteDto record, IScheduleRepository scheduleRepo) {
            return true switch {
                var x when x == !IsKeyUnique(record) => 409,
                var x when x == !IsValidCustomer(record) => 450,
                var x when x == !IsValidDestination(record) => 451,
                var x when x == !IsValidPickupPoint(record) => 452,
                var x when x == !IsValidDriver(record) => 453,
                var x when x == !IsValidShip(record) => 454,
                var x when x == !IsValidNationality(record) => 456,
                var x when x == !IsValidGender(record) => 457,
                var x when x == !IsValidOccupant(record) => 458,
                var x when x == !IsCorrectPassengerCount(record) => 455,
                var x when x == !PortHasDepartureForDateAndDestination(record) => 410,
                var x when x == SimpleUserCausesOverbooking(record.Date, record.ReservationId, record.DestinationId, GetPortIdFromPickupPointId(record), record.Adults + record.Kids + record.Free) => 433,
                var x when x == SimpleUserHasNightRestrictions(record) => 459,
                var x when x == SimpleUserCanNotAddReservationAfterDeparture(record) => 431,
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

        private bool SimpleUserCanNotAddReservationAfterDeparture(ReservationWriteDto record) {
            return !Identity.IsUserAdmin(httpContext).Result && IsAfterDeparture(record);
        }

        private bool IsValidCustomer(ReservationWriteDto record) {
            if (record.ReservationId == Guid.Empty) {
                return context.Customers.AsNoTracking().SingleOrDefault(x => x.Id == record.CustomerId && x.IsActive) != null;
            }
            return context.Customers.AsNoTracking().SingleOrDefault(x => x.Id == record.CustomerId) != null;
        }

        private bool IsValidDestination(ReservationWriteDto record) {
            if (record.ReservationId == Guid.Empty) {
                return context.Destinations.AsNoTracking().SingleOrDefault(x => x.Id == record.DestinationId && x.IsActive) != null;
            }
            return context.Destinations.AsNoTracking().SingleOrDefault(x => x.Id == record.DestinationId) != null;
        }

        private bool IsValidPickupPoint(ReservationWriteDto record) {
            if (record.ReservationId == Guid.Empty) {
                return context.PickupPoints.AsNoTracking().SingleOrDefault(x => x.Id == record.PickupPointId && x.IsActive) != null;
            }
            return context.PickupPoints.AsNoTracking().SingleOrDefault(x => x.Id == record.PickupPointId) != null;
        }

        private bool IsValidDriver(ReservationWriteDto record) {
            if (record.DriverId != null && record.DriverId != 0) {
                if (record.ReservationId == Guid.Empty) {
                    var driver = context.Drivers.AsNoTracking().SingleOrDefault(x => x.Id == record.DriverId && x.IsActive);
                    if (driver == null)
                        return false;
                } else {
                    var driver = context.Drivers.AsNoTracking().SingleOrDefault(x => x.Id == record.DriverId);
                    if (driver == null)
                        return false;
                }
            }
            return true;
        }

        private bool IsValidShip(ReservationWriteDto record) {
            if (record.ShipId != null && record.ShipId != 0) {
                if (record.ReservationId == Guid.Empty) {
                    var ship = context.Ships.AsNoTracking().SingleOrDefault(x => x.Id == record.ShipId && x.IsActive);
                    if (ship == null)
                        return false;
                } else {
                    var ship = context.Ships.AsNoTracking().SingleOrDefault(x => x.Id == record.ShipId);
                    if (ship == null)
                        return false;
                }
            }
            return true;
        }

        private static bool IsCorrectPassengerCount(ReservationWriteDto record) {
            if (record.Passengers != null) {
                if (record.Passengers.Count != 0) {
                    return record.Passengers.Count <= record.Adults + record.Kids + record.Free;
                }
            }
            return true;
        }

        private bool IsValidNationality(ReservationWriteDto record) {
            if (record.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in record.Passengers) {
                    if (record.ReservationId == Guid.Empty) {
                        isValid = context.Nationalities.AsNoTracking().SingleOrDefault(x => x.Id == passenger.NationalityId && x.IsActive) != null;
                    } else {
                        isValid = context.Nationalities.AsNoTracking().SingleOrDefault(x => x.Id == passenger.NationalityId) != null;
                    }
                }
                return record.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidGender(ReservationWriteDto record) {
            if (record.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in record.Passengers) {
                    if (record.ReservationId == Guid.Empty) {
                        isValid = context.Genders.AsNoTracking().SingleOrDefault(x => x.Id == passenger.GenderId && x.IsActive) != null;
                    } else {
                        isValid = context.Genders.AsNoTracking().SingleOrDefault(x => x.Id == passenger.GenderId) != null;
                    }
                }
                return record.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidOccupant(ReservationWriteDto record) {
            if (record.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in record.Passengers) {
                    if (record.ReservationId == Guid.Empty) {
                        isValid = context.Occupants.AsNoTracking().SingleOrDefault(x => x.Id == passenger.OccupantId && x.IsActive) != null;
                    } else {
                        isValid = context.Occupants.AsNoTracking().SingleOrDefault(x => x.Id == passenger.OccupantId) != null;
                    }
                }
                return record.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private bool SimpleUserHasNightRestrictions(ReservationWriteDto record) {
            if (!Identity.IsUserAdmin(httpContext).Result && record.ReservationId == Guid.Empty) {
                if (HasTransfer(record.PickupPointId)) {
                    if (IsForTomorrow(record)) {
                        if (IsBetweenClosingTimeAndMidnight(record)) {
                            return true;
                        }
                    }
                    if (IsForToday(record)) {
                        if (IsBetweenMidnightAndDeparture(record)) {
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

        private bool IsForTomorrow(ReservationWriteDto record) {
            var tomorrow = testingEnvironment.IsTesting ? record.TestDateNow.AddDays(1) : DateHelpers.GetLocalDateTime().AddDays(1);
            var tomorrowDate = DateHelpers.DateTimeToISOString(tomorrow);
            return record.Date == tomorrowDate;
        }

        private bool IsForToday(ReservationWriteDto record) {
            var today = testingEnvironment.IsTesting ? record.TestDateNow : DateHelpers.GetLocalDateTime();
            var todayDate = DateHelpers.DateTimeToISOString(today);
            return record.Date == todayDate;
        }

        private bool IsBetweenClosingTimeAndMidnight(ReservationWriteDto record) {
            var timeNow = testingEnvironment.IsTesting ? record.TestDateNow.TimeOfDay : DateHelpers.GetLocalDateTime().TimeOfDay;
            return timeNow.Hours >= 22;
        }

        private bool IsBetweenMidnightAndDeparture(ReservationWriteDto record) {
            var timeNow = testingEnvironment.IsTesting ? record.TestDateNow : DateHelpers.GetLocalDateTime();
            var departureTime = GetScheduleDepartureTime(record);
            return DateTime.Compare(timeNow, departureTime) < 0;
        }

        private bool IsAfterDeparture(ReservationWriteDto record) {
            var timeNow = testingEnvironment.IsTesting ? record.TestDateNow : DateHelpers.GetLocalDateTime();
            var departureTime = GetScheduleDepartureTime(record);
            return DateTime.Compare(timeNow, departureTime) > 0;
        }

        private DateTime GetScheduleDepartureTime(ReservationWriteDto record) {
            var portId = GetPortIdFromPickupPointId(record).ToString();
            var schedule = context.Schedules
                .AsNoTracking()
                .Where(x => x.Date.ToString() == record.Date && x.DestinationId == record.DestinationId && x.PortId.ToString() == portId)
                .SingleOrDefault();
            var departureTime = schedule.Date.ToString("yyyy-MM-dd") + " " + schedule.DepartureTime;
            var departureTimeAsDate = DateTime.Parse(departureTime);
            return departureTimeAsDate;
        }

    }

}