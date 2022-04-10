using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Embarkation.Printer {

    public class EmbarkationPrinterRepository : Repository<Reservation>, IEmbarkationPrinterRepository {

        private readonly IMapper mapper;
        private readonly DirectoryLocations directoryLocations;

        public EmbarkationPrinterRepository(IOptions<DirectoryLocations> directoryLocations, AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> testingSettings) : base(appDbContext, testingSettings) {
            this.mapper = mapper;
            this.directoryLocations = directoryLocations.Value;
        }

        public async Task<EmbarkationPrinterGroupVM<EmbarkationPrinterVM>> Get(string date, int destinationId, int portId, int shipId) {
            var reservations = await context.Set<Reservation>()
                .Include(x => x.Customer)
                .Include(x => x.Driver)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.Date == Convert.ToDateTime(date)
                    && x.DestinationId == destinationId
                    && x.PortId == portId
                    && x.ShipId == shipId)
                .ToListAsync();
            int totalPersons = reservations.Sum(x => x.TotalPersons);
            int passengers = reservations.Sum(c => c.Passengers.Count);
            var mainResult = new EmbarkationPrinterGroup<Reservation> {
                PassengerCount = totalPersons,
                PassengerCountWithNames = passengers,
                PassengerCountWithNoNames = totalPersons - passengers,
                Embarkation = reservations.ToList()
            };
            return mapper.Map<EmbarkationPrinterGroup<Reservation>, EmbarkationPrinterGroupVM<EmbarkationPrinterVM>>(mainResult);
        }

        public EmbarkationPrinterGroupVM<EmbarkationPrinterVM> DoReportTasks(EmbarkationPrinterCriteria criteria) {
            var reservations = context.Set<Reservation>()
                .Include(x => x.Customer)
                .Include(x => x.Driver)
                .Include(x => x.Passengers)
                .Where(x => x.Date == Convert.ToDateTime(criteria.Date)
                    && x.DestinationId == criteria.DestinationId
                    && x.PortId == criteria.PortId
                    && x.ShipId == criteria.ShipId)
                .ToList();
            int totalPersons = reservations.Sum(x => x.TotalPersons);
            int passengers = reservations.Sum(c => c.Passengers.Count);
            var mainResult = new EmbarkationPrinterGroup<Reservation> {
                Date = criteria.Date,
                Destination = context.Destinations.Where(x => x.Id == criteria.DestinationId).Select(x => x.Description).FirstOrDefault(),
                Port = context.Ports.Where(x => x.Id == criteria.PortId).Select(x => x.Description).FirstOrDefault(),
                Ship = context.Ships.Where(x => x.Id == criteria.ShipId).Select(x => x.Description).FirstOrDefault(),
                PassengerCount = totalPersons,
                PassengerCountWithNames = passengers,
                PassengerCountWithNoNames = totalPersons - passengers,
                Embarkation = reservations.ToList()
            };
            return mapper.Map<EmbarkationPrinterGroup<Reservation>, EmbarkationPrinterGroupVM<EmbarkationPrinterVM>>(mainResult);
        }

        public FileStreamResult DownloadReport(string filename) {
            byte[] byteArray = File.ReadAllBytes(directoryLocations.ReportsLocation + Path.DirectorySeparatorChar + filename);
            File.WriteAllBytes(filename, byteArray);
            MemoryStream memoryStream = new(byteArray);
            return new FileStreamResult(memoryStream, "application/pdf");
        }

    }

}