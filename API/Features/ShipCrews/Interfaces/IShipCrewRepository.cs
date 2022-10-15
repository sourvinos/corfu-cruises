using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.ShipCrews {

    public interface IShipCrewRepository : IRepository<ShipCrew> {

        Task<IEnumerable<ShipCrewListVM>> Get();
        Task<IEnumerable<ShipCrewActiveVM>> GetActive();
        Task<ShipCrew> GetById(int id, bool includeTables);

    }

}