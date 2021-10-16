using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Customers {

    public interface ICustomerRepository : IRepository<Customer> {

        Task<IEnumerable<CustomerListResource>> Get();
        new Task<CustomerReadResource> GetById(int id);
        Task<Customer> GetByIdToDelete(int id);
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();

    }

}