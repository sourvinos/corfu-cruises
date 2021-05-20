using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class ReservationRepository : Repository<Reservation>, IReservationRepository {

        private readonly IMapper mapper;
        private readonly UserManager<AppUser> userManager;
        private readonly IConverter converter;

        public ReservationRepository(DbContext appDbContext, IMapper mapper, UserManager<AppUser> userManager, IConverter converter) : base(appDbContext) {
            this.mapper = mapper;
            this.userManager = userManager;
            this.converter = converter;
        }

        public async Task<ReservationGroupReadResource<ReservationReadResource>> Get(string userId, string date) {
            var user = await this.GetUser(userId);
            var reservations = await context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.Date == date && (user.IsAdmin ? true : x.CustomerId == user.CustomerId))
                .OrderBy(x => x.Date).ToListAsync();
            var PersonsPerCustomer = context.Reservations.Include(x => x.Customer).Where(x => x.Date == date && (user.IsAdmin ? true : x.CustomerId == user.CustomerId)).GroupBy(x => new { x.Customer.Description }).Select(x => new PersonsPerCustomer { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var PersonsPerDestination = context.Reservations.Include(x => x.Destination).Where(x => x.Date == date && (user.IsAdmin ? true : x.CustomerId == user.CustomerId)).GroupBy(x => new { x.Destination.Description }).Select(x => new PersonsPerDestination { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var PersonsPerRoute = context.Reservations.Include(x => x.PickupPoint.Route).Where(x => x.Date == date && (user.IsAdmin ? true : x.CustomerId == user.CustomerId)).GroupBy(x => new { x.PickupPoint.Route.Abbreviation }).Select(x => new PersonsPerRoute { Description = x.Key.Abbreviation, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var PersonsPerDriver = context.Reservations.Include(x => x.Driver).Where(x => x.Date == date && (user.IsAdmin ? true : x.CustomerId == user.CustomerId)).OrderBy(o => o.Driver.Description).GroupBy(x => new { x.Driver.Description }).Select(x => new PersonsPerDriver { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var PersonsPerPort = context.Reservations.Include(x => x.PickupPoint.Route.Port).Where(x => x.Date == date && (user.IsAdmin ? true : x.CustomerId == user.CustomerId)).OrderBy(o => o.PickupPoint.Route.Port.Description).GroupBy(x => new { x.PickupPoint.Route.Port.Description }).Select(x => new PersonsPerPort { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var totalPersonsPerShip = context.Reservations.Include(x => x.Ship).Where(x => x.Date == date && (user.IsAdmin ? true : x.CustomerId == user.CustomerId)).OrderBy(o => o.Ship.Description).GroupBy(x => new { x.Ship.Description }).Select(x => new PersonsPerShip { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) }).OrderBy(o => o.Description);
            var mainResult = new MainResult<Reservation> {
                Persons = reservations.Sum(x => x.TotalPersons),
                Reservations = reservations.ToList(),
                PersonsPerCustomer = PersonsPerCustomer.ToList(),
                PersonsPerDestination = PersonsPerDestination.ToList(),
                PersonsPerRoute = PersonsPerRoute.ToList(),
                PersonsPerDriver = PersonsPerDriver.ToList(),
                PersonsPerPort = PersonsPerPort.ToList(),
                PersonsPerShip = totalPersonsPerShip.ToList()
            };
            return mapper.Map<MainResult<Reservation>, ReservationGroupReadResource<ReservationReadResource>>(mainResult);
        }

        public IEnumerable<MainResult> GetForDestination(int destinationId) {
            var totalReservationsPerDestination = context.Reservations
                .Where(x => x.DestinationId == destinationId)
                .AsEnumerable()
                .GroupBy(x => new { x.Date })
                .Select(x => new MainResult {
                    Date = x.Key.Date,
                    DestinationId = destinationId,
                    PortPersons = x.GroupBy(z => z.PortId).Select(z => new PortPersons {
                        PortId = z.Key,
                        Persons = z.Sum(x => x.TotalPersons)
                    }).OrderBy(x => x.PortId)
                }).OrderBy(x => x.Date);
            return totalReservationsPerDestination;
        }

        public ReservationTotalPersons GetForDateAndDestinationAndPort(string date, int destinationId, int portId) {
            var totalPersons = context.Reservations
                .Where(x => x.Date == date && x.DestinationId == destinationId && x.PortId == portId)
                .Sum(x => x.TotalPersons);
            var reservationTotalPersons = new ReservationTotalPersons {
                Date = date,
                DestinationId = destinationId,
                PortId = portId,
                TotalPersons = totalPersons
            };
            return reservationTotalPersons;
        }

        public async Task<Reservation> GetById(string id) {
            return await context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.Ship)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
                .Include(x => x.Passengers).ThenInclude(x => x.Gender)
                .FirstAsync(x => x.ReservationId.ToString() == id);
        }

        public bool Update(string id, Reservation updatedRecord) {
            using var transaction = context.Database.BeginTransaction();
            try {
                context.Entry(updatedRecord).State = EntityState.Modified;
                context.SaveChanges();
                RemovePassengers(GetReservationById(id));
                AddPassengers(updatedRecord);
                transaction.Commit();
                return true;
            } catch (Exception) {
                transaction.Rollback();
                return false;
            }
        }

        public void AssignToDriver(int driverId, string[] ids) {
            var reservations = context.Reservations.Where(x => ids.Contains(x.ReservationId.ToString())).ToList();
            reservations.ForEach(a => a.DriverId = driverId);
            context.SaveChanges();
        }

        public void AssignToShip(int shipId, string[] ids) {
            var records = context.Reservations.Where(x => ids.Contains(x.ReservationId.ToString())).ToList();
            records.ForEach(a => a.ShipId = shipId);
            context.SaveChanges();
        }

        private Reservation GetReservationById(string id) {
            var record = context.Reservations
                .Include(x => x.Passengers)
                .AsNoTracking()
                .SingleOrDefault(x => x.ReservationId.ToString() == id);
            return record;
        }

        private void RemovePassengers(Reservation currentRecord) {
            context.Passengers.RemoveRange(currentRecord.Passengers);
            context.SaveChanges();
        }

        private void AddPassengers(Reservation updatedRecord) {
            var records = new List<Passenger>();
            foreach (var record in updatedRecord.Passengers) {
                records.Add(record);
            };
            context.Passengers.AddRange(records);
            context.SaveChanges();
        }

        private bool IsUserAdmin(bool isAdmin) {
            return isAdmin;
        }

        private async Task<AppUser> GetUser(string userId) {
            AppUser user = await userManager.FindByIdAsync(userId);
            return user;
        }

        public byte[] PrintVoucher(Voucher voucher) {

            var passengers = "";
            var globalSettings = new GlobalSettings {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings { Top = 10 },
                DocumentTitle = "Voucher"
            };

            foreach (var passenger in voucher.Passengers) {
                passengers += passenger.Lastname + " " + passenger.Firstname + "<br />";
            }

            var body = "Date: " + voucher.Date + "<br />" +
                    "Destination: " + voucher.DestinationDescription + "<br />" +
                    "Pickup point" + "<br />" +
                        "Description: " + voucher.PickupPointDescription + "<br />" +
                        "Exact point: " + voucher.PickupPointExactPoint + "<br />" +
                        "Time: " + voucher.PickupPointTime + "<br />" +
                    "Phones: " + voucher.Phones + "<br />" +
                    "Remarks: " + voucher.Remarks + "<br />" +
                    "<br />" +
                    "Passengers " + "<br />" + passengers +
                    "<div style='align-items: center; display: flex; height: 200px; justify-content: center; margin-bottom: 1rem; margin-top: 1rem; width: 200px;'>" +
                        "<img src=" + voucher.URI + " />" + "<br />" +
                    "</div>";

            var objectSettings = new ObjectSettings {
                PagesCount = true,
                HtmlContent = TemplateGenerator.GetHtmlString(body),
                WebSettings = { DefaultEncoding = "utf-8" },
                HeaderSettings = { FontName = "Arial", FontSize = 9, Right = "Page [page] of [toPage]", Line = true },
                FooterSettings = { FontName = "Arial", FontSize = 9, Line = true, Center = "Report Footer" }
            };

            var pdf = new HtmlToPdfDocument {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };

            converter.Convert(pdf);

            var file = converter.Convert(pdf);

            return file;

            // return File(file, "application/pdf");

        }

    }

}