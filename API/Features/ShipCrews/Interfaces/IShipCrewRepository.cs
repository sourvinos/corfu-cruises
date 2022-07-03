using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;

namespace API.Features.ShipCrews {

    public interface IShipCrewRepository : IRepository<ShipCrew> {

        Task<IEnumerable<ShipCrewListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        new Task<ShipCrewReadResource> GetById(int id);
        Task<ShipCrew> GetByIdToDelete(int id);
        int IsValid(ShipCrewWriteResource record);

    }

}