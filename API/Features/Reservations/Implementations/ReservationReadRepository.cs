using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Features.Drivers;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Identity;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Reservations {

    public class ReservationReadRepository : Repository<Reservation>, IReservationReadRepository {

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;
        private readonly UserManager<UserExtended> userManager;

        public ReservationReadRepository(AppDbContext context, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> testingEnvironment, UserManager<UserExtended> userManager) : base(context, testingEnvironment) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.userManager = userManager;
        }

        public async Task<ReservationMappedGroupVM<ReservationMappedListVM>> GetForDailyList(string date) {
            IEnumerable<Reservation> reservations = Array.Empty<Reservation>();
            if (Identity.IsUserAdmin(httpContext)) {
                reservations = GetReservationsFromAllUsersByDate(date);
            } else {
                var simpleUser = await Identity.GetConnectedUserId(httpContext);
                var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, simpleUser);
                reservations = GetReservationsForLinkedCustomer(date, (int)connectedUserDetails.CustomerId);
            }
            var mainResult = new ReservationInitialGroupVM<Reservation> {
                Persons = reservations.Sum(x => x.TotalPersons),
                Reservations = reservations.ToList(),
            };
            return mapper.Map<ReservationInitialGroupVM<Reservation>, ReservationMappedGroupVM<ReservationMappedListVM>>(mainResult);
        }

        public async Task<ReservationMappedGroupVM<ReservationMappedListVM>> GetByRefNo(string refNo) {
            IEnumerable<Reservation> reservations = Array.Empty<Reservation>();
            var connectedUser = await Identity.GetConnectedUserId(httpContext);
            if (Identity.IsUserAdmin(httpContext)) {
                reservations = GetReservationsFromAllUsersByRefNo(refNo);
            } else {
                var simpleUser = await Identity.GetConnectedUserId(httpContext);
                var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, simpleUser);
                reservations = GetReservationsFromLinkedCustomerbyRefNo(refNo, (int)connectedUserDetails.CustomerId);
            }
            var mainResult = new ReservationInitialGroupVM<Reservation> {
                Persons = reservations.Sum(x => x.TotalPersons),
                Reservations = reservations.ToList(),
            };
            return mapper.Map<ReservationInitialGroupVM<Reservation>, ReservationMappedGroupVM<ReservationMappedListVM>>(mainResult);
        }

        public async Task<ReservationDriverGroupVM<Reservation>> GetByDateAndDriver(string date, int driverId) {
            var driver = await GetDriver(driverId);
            var reservations = await GetReservationsByDateAndDriver(date, driverId);
            return new ReservationDriverGroupVM<Reservation> {
                Date = date,
                DriverId = driver != null ? driverId : 0,
                DriverDescription = driver != null ? driver.Description : "(EMPTY)",
                Phones = driver != null ? driver.Phones : "(EMPTY)",
                Reservations = mapper.Map<IEnumerable<Reservation>, IEnumerable<ReservationDriverListVM>>(reservations)
            };
        }

        public async Task<Reservation> GetById(string reservationId, bool includeTables) {
            return includeTables
                ? await context.Reservations
                    .Include(x => x.Customer)
                    .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                    .Include(x => x.Destination)
                    .Include(x => x.Driver)
                    .Include(x => x.Ship)
                    .Include(x => x.User)
                    .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                    .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
                    .Include(x => x.Passengers).ThenInclude(x => x.Gender)
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.ReservationId.ToString() == reservationId)
                : await context.Reservations
                    .Include(x => x.Passengers)
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.ReservationId.ToString() == reservationId);
        }

        private IEnumerable<Reservation> GetReservationsFromAllUsersByDate(string date) {
            return context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.Date == Convert.ToDateTime(date));
        }

        private IEnumerable<Reservation> GetReservationsForLinkedCustomer(string date, int customerId) {
            var reservations = context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.Date == Convert.ToDateTime(date) && x.CustomerId == customerId);
            return reservations;
        }

        private IEnumerable<Reservation> GetReservationsFromAllUsersByRefNo(string refNo) {
            return context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.RefNo == refNo);
        }

        private IEnumerable<Reservation> GetReservationsFromLinkedCustomerbyRefNo(string refNo, int customerId) {
            return context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.RefNo == refNo && x.CustomerId == customerId);
        }

        private async Task<IEnumerable<Reservation>> GetReservationsByDateAndDriver(string date, int driverId) {
            return await context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint)
                .Include(x => x.Passengers)
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DriverId == (driverId != 0 ? driverId : null))
                .OrderBy(x => x.PickupPoint.Time).ThenBy(x => x.PickupPoint.Description)
                .ToListAsync();
        }

        private async Task<Driver> GetDriver(int driverId) {
            return await context.Drivers
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == driverId);
        }

    }

}