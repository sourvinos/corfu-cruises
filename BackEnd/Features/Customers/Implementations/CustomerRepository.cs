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
            List<Customer> records = await context.Customers
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Customer>, IEnumerable<CustomerListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<Customer> records = await context.Customers
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Customer>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<CustomerReadResource> GetById(int id) {
            Customer record = await context.Customers
                .SingleOrDefaultAsync(m => m.Id == id);
            return mapper.Map<Customer, CustomerReadResource>(record);
        }

        public async Task<Customer> GetByIdToDelete(int id) {
            return await context.Customers
                .SingleOrDefaultAsync(m => m.Id == id);
        }

    }

}