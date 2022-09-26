using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;

namespace API.Features.Ships {

    public interface IShipRepository : IRepository<Ship> {

        Task<IEnumerable<SimpleResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActive();
        Task<Ship> GetById(int id, bool trackChanges);

    }

}