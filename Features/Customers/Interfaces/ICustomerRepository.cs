using System.Collections.Generic;
using System.Threading.Tasks;
using ShipCruises.Features.Customers;

namespace ShipCruises {

    public interface ICustomerRepository : IRepository<Customer> {

        Task<IEnumerable<CustomerDropdownResource>> GetActiveForDropdown();

    }

}