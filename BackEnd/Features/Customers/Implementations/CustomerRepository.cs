using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Customers {

    public class CustomerRepository : Repository<Customer>, ICustomerRepository {

        private readonly IMapper mapper;

        public CustomerRepository(AppDbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<CustomerListResource>> Get() {
            var customers = await context.Set<Customer>()
                .Where(x => x.Id != 1)
                .OrderBy(o => o.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Customer>, IEnumerable<CustomerListResource>>(customers);
            // return customers;
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            var records = await context
                .Set<Customer>()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Customer>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<CustomerReadResource> GetById(int id) {
            var customer = await context.Set<Customer>()
                .SingleOrDefaultAsync(m => m.Id == id);
            return mapper.Map<Customer, CustomerReadResource>(customer);
        }

        public async Task<Customer> GetByIdToDelete(int id) {
            return await context.Set<Customer>().SingleOrDefaultAsync(m => m.Id == id);
        }

    }

}