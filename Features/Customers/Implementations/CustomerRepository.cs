using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class CustomerRepository : Repository<Customer>, ICustomerRepository {

        public CustomerRepository(DbContext appDbContext) : base(appDbContext) { }

        public async Task<List<CustomerResource>> GetFieldSubset() {
            return await context.Customers.Select(x => new CustomerResource {
                Id = x.Id,
                Description = x.Description
            }).ToListAsync();
        }

    }

}