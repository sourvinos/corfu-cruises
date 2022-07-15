using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.ShipCrews {

    public interface IShipCrewRepository : IRepository<ShipCrew> {

        Task<IEnumerable<ShipCrew>> Get();
        Task<IEnumerable<ShipCrew>> GetActiveForDropdown();
        new Task<ShipCrew> GetById(int id);
        Task<ShipCrew> GetByIdToDelete(int id);
        int IsValid(ShipCrewWriteDto record);

    }

}