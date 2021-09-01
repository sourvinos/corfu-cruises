using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Ships {

    public interface IShipRepository : IRepository<Ship> {

        Task<IEnumerable<ShipListResource>> Get();
        Task<IEnumerable<ShipDropdownResource>> GetActiveForDropdown();
        Task<Ship> GetByIdToDelete(int shipId);
        new Task<ShipReadResource> GetById(int shipId);

    }

}