using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;

namespace API.Features.Customers {

    public interface ICustomerRepository : IRepository<Customer> {

        Task<IEnumerable<CustomerListVM>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<Customer> GetByIdToDelete(int id);

    }

}