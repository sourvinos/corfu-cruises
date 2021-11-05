using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Ships {

    public interface IShipOwnerRepository : IRepository<ShipOwner> {

        Task<IEnumerable<ShipOwnerListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        new Task<ShipOwnerReadResource> GetById(int id);
        Task<ShipOwner> GetByIdToDelete(int id);

    }

}