using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises {

    public interface ICustomerRepository : IRepository<Customer> {

        Task<IEnumerable<CustomerDropdownResource>> GetActiveForDropdown();

    }

}