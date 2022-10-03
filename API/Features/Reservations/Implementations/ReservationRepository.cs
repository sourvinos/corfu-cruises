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

    public class ReservationRepository : Repository<Reservation>, IReservationRepository {

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;
        private readonly TestingEnvironment testingEnvironment;
        private readonly UserManager<UserExtended> userManager;

        public ReservationRepository(AppDbContext context, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> testingEnvironment, UserManager<UserExtended> userManager) : base(context, testingEnvironment) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.testingEnvironment = testingEnvironment.Value;
            this.userManager = userManager;
        }

        public async Task<ReservationMappedGroupVM<ReservationMappedListVM>> GetByDate(string date) {
            IEnumerable<Reservation> reservations = Array.Empty<Reservation>();
            if (await Identity.IsUserAdmin(httpContext)) {
                reservations = GetReservationsFromAllUsersByDate(date);
            } else {
                var simpleUser = await Identity.GetConnectedUserId(httpContext);
                var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, simpleUser.UserId);
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
            if (await Identity.IsUserAdmin(httpContext)) {
                reservations = GetReservationsFromAllUsersByRefNo(refNo);
            } else {
                var simpleUser = await Identity.GetConnectedUserId(httpContext);
                var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, simpleUser.UserId);
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
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.ReservationId.ToString() == reservationId);
        }

        public async Task Update(string id, Reservation updatedRecord) {
            var strategy = context.Database.CreateExecutionStrategy();
            await strategy.Execute(async () => {
                using var transaction = context.Database.BeginTransaction();
                if (await Identity.IsUserAdmin(httpContext)) {
                    await UpdateReservation(updatedRecord);
                }
                await RemovePassengers(GetPassengersForReservation(id));
                await AddPassengers(updatedRecord);
                if (testingEnvironment.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
            });
        }

        public void AssignToDriver(int driverId, string[] ids) {
            var strategy = context.Database.CreateExecutionStrategy();
            strategy.Execute(() => {
                using var transaction = context.Database.BeginTransaction();
                var reservations = context.Reservations
                    .Where(x => ids.Contains(x.ReservationId.ToString()))
                    .ToList();
                reservations.ForEach(a => a.DriverId = driverId);
                context.SaveChanges();
                if (testingEnvironment.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
            });
        }

        public void AssignToShip(int shipId, string[] ids) {
            var strategy = context.Database.CreateExecutionStrategy();
            strategy.Execute(() => {
                using var transaction = context.Database.BeginTransaction();
                var reservations = context.Reservations
                    .Where(x => ids.Contains(x.ReservationId.ToString()))
                    .ToList();
                reservations.ForEach(a => a.ShipId = shipId);
                context.SaveChanges();
                if (testingEnvironment.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
            });
        }

        public async Task<string> AssignRefNoToNewReservation(ReservationWriteDto reservation) {
            return await GetDestinationAbbreviation(reservation) + await IncrementRefNoByOne();
        }

        public async Task<ReservationWriteDto> AttachUserIdToDto(ReservationWriteDto reservation) {
            var user = await Identity.GetConnectedUserId(httpContext);
            reservation.UserId = user.UserId;
            return reservation;
        }

        private IEnumerable<Passenger> GetPassengersForReservation(string id) {
            return context.Passengers
                .AsNoTracking()
                .Where(x => x.ReservationId.ToString() == id)
                .ToList();
        }

        private async Task UpdateReservation(Reservation updatedRecord) {
            context.Entry(updatedRecord).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        private async Task AddPassengers(Reservation updatedRecord) {
            var records = new List<Passenger>();
            records.AddRange(updatedRecord.Passengers);
            context.Passengers.AddRange(records);
            await context.SaveChangesAsync();
        }

        private async Task RemovePassengers(IEnumerable<Passenger> passengers) {
            context.Passengers.RemoveRange(passengers);
            await context.SaveChangesAsync();
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

        private async Task<string> IncrementRefNoByOne() {
            var refNo = context.RefNos.First();
            refNo.LastRefNo++;
            context.Entry(refNo).State = EntityState.Modified;
            var strategy = context.Database.CreateExecutionStrategy();
            await strategy.Execute(async () => {
                using var transaction = context.Database.BeginTransaction();
                await context.SaveChangesAsync();
                transaction.Commit();
            });
            return refNo.LastRefNo.ToString();
        }

        private async Task<string> GetDestinationAbbreviation(ReservationWriteDto record) {
            var destination = await context.Destinations
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == record.DestinationId);
            return destination.Abbreviation;
        }

        private async Task<Driver> GetDriver(int driverId) {
            return await context.Drivers
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == driverId);
        }

    }

}