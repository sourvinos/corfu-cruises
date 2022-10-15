using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Ships {

    public interface IShipRepository : IRepository<Ship> {

        Task<IEnumerable<ShipListVM>> Get();
        Task<IEnumerable<ShipActiveVM>> GetActive();
        Task<Ship> GetById(int id, bool includeTables);

    }

}