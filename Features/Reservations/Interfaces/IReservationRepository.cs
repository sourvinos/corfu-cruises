using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Reservations {

    public interface IReservationRepository : IRepository<Reservation> {

        Task<ReservationGroupResource<ReservationListResource>> GetForDate(string date);
        IEnumerable<MainResult> GetForDestination(int destinationId);
        ReservationTotalPersons GetForDateAndDestinationAndPort(string date, int destinationId, int portId);
        Task<ReservationReadResource> GetSingle(string id);
        Task<Reservation> GetSingleToDelete(string id);
        bool Update(string id, Reservation updatedRecord);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);
        bool IsKeyUnique(ReservationWriteResource record);

        IEnumerable<ReservationResource> GetForPeriod(string fromDate, string toDate);

    }

}