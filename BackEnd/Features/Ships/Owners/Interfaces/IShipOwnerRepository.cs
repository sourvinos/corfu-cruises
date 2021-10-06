using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Ships {

    public interface IShipOwnerRepository : IRepository<ShipOwner> {

        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();

    }

}