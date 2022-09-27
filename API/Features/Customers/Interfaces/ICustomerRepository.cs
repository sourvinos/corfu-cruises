using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Customers {

    public interface ICustomerRepository : IRepository<Customer> {

        Task<IEnumerable<CustomerListVM>> Get();
        Task<IEnumerable<CustomerActiveVM>> GetActive();
        Task<Customer> GetById(int id, bool trackChanges);
        Task<CustomerWriteDto> AttachUserIdToDto(CustomerWriteDto port);

    }

}