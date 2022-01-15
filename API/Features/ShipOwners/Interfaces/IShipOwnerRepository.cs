using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;

namespace API.Features.ShipOwners {

    public interface IShipOwnerRepository : IRepository<ShipOwner> {

        Task<IEnumerable<ShipOwnerListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<ShipOwner> GetByIdToDelete(int id);

    }

}