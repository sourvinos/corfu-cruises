using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Ships {

    public interface IShipRepository : IRepository<Ship> {

        Task<IEnumerable<Ship>> Get();
        Task<IEnumerable<Ship>> GetActiveForDropdown();
        Task<Ship> GetByIdToDelete(int shipId);
        new Task<Ship> GetById(int shipId);
        int IsValid(ShipWriteDto record);

    }

}