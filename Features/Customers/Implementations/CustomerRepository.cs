using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ShipCruises.Features.Customers;

namespace ShipCruises {

    public class CustomerRepository : Repository<Customer>, ICustomerRepository {

        private readonly IMapper mapper;

        public CustomerRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<CustomerDropdownResource>> GetActiveForDropdown() {
            var records = await context
                .Set<Customer>()
                .Where(x => x.IsActive)
                .ToListAsync();
            return mapper.Map<IEnumerable<Customer>, IEnumerable<CustomerDropdownResource>>(records);
        }

    }

}