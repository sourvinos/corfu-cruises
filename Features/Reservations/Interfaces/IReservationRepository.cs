using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IReservationRepository : IRepository<Reservation> {

        Task<ReservationGroupReadResource<ReservationReadResource>> Get(string userId, string dateIn);
        IEnumerable<MainResult> GetForDestination(int destinationId);
        ReservationTotalPersons GetForDateAndDestinationAndPort(string date, int destinationId, int portId);
        Task<Reservation> GetById(string id);
        bool Update(string id, Reservation updatedRecord);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);
        bool IsKeyUniqueOnAdd(ReservationWriteResource record);
        bool IsKeyUniqueOnEdit(ReservationWriteResource record);

    }

}