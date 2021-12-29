using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Interfaces;

namespace BlueWaterCruises.Features.Customers {

    public interface ICustomerRepository : IRepository<Customer> {

        Task<IEnumerable<CustomerListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<Customer> GetByIdToDelete(int id);

    }

}