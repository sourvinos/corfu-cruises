using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises {

    public interface IReservationRepository : IRepository<Reservation> {

        Task<ReservationGroupReadResource<ReservationReadResource>> Get(string date);
        IEnumerable<MainResult> GetForDestination(int destinationId);
        ReservationTotalPersons GetForDateAndDestinationAndPort(string date, int destinationId, int portId);
        Task<Reservation> GetById(string id);
        bool Update(string id, Reservation updatedRecord);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);
        bool IsKeyUnique(ReservationWriteResource record);

    }

}