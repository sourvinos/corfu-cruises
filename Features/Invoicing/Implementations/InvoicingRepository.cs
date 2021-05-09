using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class InvoicingRepository : IInvoicingRepository {

        private readonly DbContext context;
        private readonly IMapper mapper;

        public InvoicingRepository(DbContext appDbContext, IMapper mapper) {
            this.context = appDbContext;
            this.mapper = mapper;
        }

        public IEnumerable<InvoicingReservationViewModel> Get(string date) {
            var result = context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Ship)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route)
                .OrderBy(x => x.Customer)
                .Where(x => x.Date == date)
                .AsEnumerable();
            return mapper.Map<IEnumerable<Reservation>, IEnumerable<InvoicingReservationViewModel>>(result);
        }

    }

    public class Group {

        public string Customer { get; set; }

        public IEnumerable<Reservation> Records { get; set; }

    }

}