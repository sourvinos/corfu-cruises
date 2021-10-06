using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Customers {

    public interface ICustomerRepository : IRepository<Customer> {

        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();

    }

}