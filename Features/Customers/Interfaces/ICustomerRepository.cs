using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface ICustomerRepository : IRepository<Customer> {

        Task<List<CustomerResource>> GetFieldSubset();

    }

}