using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IReservationRepository : IRepository<Reservation> {

        Task<ReservationGroupReadResource<ReservationReadResource>> Get(string dateIn);
        IEnumerable<TotalPersonsPerDestinationAndPort> GetForDestinationAndPort(int destinationId, int portId);
        new Task<Reservation> GetById(int id);
        void Update(int id, Reservation updatedRecord);
        void AssignToDriver(int driverId, int[] ids);
        void AssignToShip(int shipId, int[] ids);

    }

}