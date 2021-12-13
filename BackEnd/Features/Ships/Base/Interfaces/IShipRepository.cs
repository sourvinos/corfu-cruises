using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Interfaces;

namespace BlueWaterCruises.Features.Ships.Base {

    public interface IShipRepository : IRepository<Ship> {

        Task<IEnumerable<ShipListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<Ship> GetByIdToDelete(int shipId);
        new Task<ShipReadResource> GetById(int shipId);

    }

}