using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.ShipOwners {

    public interface IShipOwnerRepository : IRepository<ShipOwner> {

        Task<IEnumerable<ShipOwnerListVM>> Get();
        Task<IEnumerable<ShipOwnerActiveVM>> GetActive();
        Task<ShipOwner> GetById(int id);

    }

}