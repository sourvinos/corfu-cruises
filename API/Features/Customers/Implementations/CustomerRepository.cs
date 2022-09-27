using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Customers {

    public class CustomerRepository : Repository<Customer>, ICustomerRepository {

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        public CustomerRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.httpContext = httpContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<CustomerListVM>> Get() {
            List<Customer> customers = await context.Customers
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Customer>, IEnumerable<CustomerListVM>>(customers);
        }

        public async Task<IEnumerable<CustomerActiveVM>> GetActive() {
            List<Customer> activeCustomers = await context.Customers
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Customer>, IEnumerable<CustomerActiveVM>>(activeCustomers);
        }

        public async Task<Customer> GetById(int id, bool includeTables) {
            return await context.Customers.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<CustomerWriteDto> AttachUserIdToDto(CustomerWriteDto customer) {
            var user = await Identity.GetConnectedUserId(httpContext);
            customer.UserId = user.UserId;
            return customer;
        }

    }

}