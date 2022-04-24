using System;
using System.IO;
using System.Linq;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Invoicing.Printer {

    public class InvoicingPrinterRepository : Repository<InvoicingPrinterRepository>, IInvoicingPrinterRepository {

        private readonly DirectoryLocations directoryLocations;
        private readonly IMapper mapper;

        public InvoicingPrinterRepository(AppDbContext appDbContext, IMapper mapper, IOptions<DirectoryLocations> directoryLocations, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.directoryLocations = directoryLocations.Value;
            this.mapper = mapper;
        }

        public InvoicingPrinterVM Get(InvoicingPrinterCriteria criteria) {
            var record = context.Set<Reservation>()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.PickupPoint).ThenInclude(x => x.CoachRoute)
                .Include(x => x.Port)
                .Include(x => x.Ship)
                .Where(x => x.Date == Convert.ToDateTime(criteria.Date)
                    && x.CustomerId == criteria.CustomerId)
                .AsEnumerable()
                .GroupBy(x => x.Customer).OrderBy(x => x.Key.Description)
                .Select(x => new InvoicingPrinterDTO {
                    Date = criteria.Date,
                    Customer = new SimpleResource { Id = x.Key.Id, Description = x.Key.Description },
                    Ports = x.GroupBy(x => x.Port).OrderBy(x => !x.Key.IsPrimary).Select(x => new InvoicingPrinterPortDTO {
                        Port = x.Key.Description,
                        HasTransferGroup = x.GroupBy(x => x.PickupPoint.CoachRoute.HasTransfer).Select(x => new HasTransferGroupDTO {
                            HasTransfer = x.Key,
                            Adults = x.Sum(x => x.Adults),
                            Kids = x.Sum(x => x.Kids),
                            Free = x.Sum(x => x.Free),
                            TotalPersons = x.Sum(x => x.TotalPersons),
                        }).OrderBy(x => !x.HasTransfer),
                        Adults = x.Sum(x => x.Adults),
                        Kids = x.Sum(x => x.Kids),
                        Free = x.Sum(x => x.Free),
                        TotalPersons = x.Sum(x => x.TotalPersons)
                    }),
                    Adults = x.Sum(x => x.Adults),
                    Kids = x.Sum(x => x.Kids),
                    Free = x.Sum(x => x.Free),
                    TotalPersons = x.Sum(x => x.TotalPersons),
                    Reservations = x.OrderBy(x => !x.PickupPoint.CoachRoute.HasTransfer).ToList()
                }).FirstOrDefault();
            return mapper.Map<InvoicingPrinterDTO, InvoicingPrinterVM>(record);
        }

        public FileStreamResult OpenReport(string filename) {
            byte[] byteArray = File.ReadAllBytes(directoryLocations.ReportsLocation + Path.DirectorySeparatorChar + filename);
            File.WriteAllBytes(filename, byteArray);
            MemoryStream memoryStream = new(byteArray);
            return new FileStreamResult(memoryStream, "application/pdf");
        }

    }

}