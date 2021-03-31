using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IRsvRepository : IRepository<Rsv> {

        Task<RsvGroupResultResource<RsvResource>> Get(string dateIn);
        IEnumerable<RsvPerDestinationAndPort> GetForDestinationAndPort(int destinationId, int portId);
        new Task<Rsv> GetById(int id);
        void UpdateWithDetails(int id, Rsv updatedRecord);
        void AssignToDriver(int driverId, int[] ids);
        void AssignToShip(int shipId, int[] ids);

    }

}