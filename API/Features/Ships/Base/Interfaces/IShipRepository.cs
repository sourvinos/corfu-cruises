using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;

namespace API.Features.Ships.Base {

    public interface IShipRepository : IRepository<Ship> {

        Task<IEnumerable<ShipListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<Ship> GetByIdToDelete(int shipId);
        new Task<Ship> GetById(int shipId);
        int IsValid(ShipWriteResource record);
    }

}