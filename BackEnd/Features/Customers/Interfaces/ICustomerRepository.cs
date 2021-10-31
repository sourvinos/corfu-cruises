using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Customers {

    public interface ICustomerRepository : IRepository<Customer> {

        Task<IEnumerable<CustomerListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        new Task<CustomerReadResource> GetById(int id);
        Task<Customer> GetByIdToDelete(int id);

    }

}