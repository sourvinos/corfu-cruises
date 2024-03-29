using System.Threading.Tasks;
using API.Features.Schedules;
using API.Infrastructure.Interfaces;

namespace API.Features.Reservations {

    public interface IReservationRepository : IRepository<Reservation> {

        Task<ReservationGroupResource<ReservationListResource>> GetByDate(string date);
        Task<ReservationGroupResource<ReservationListResource>> GetByRefNo(string refNo);
        Task<DriverResult<Reservation>> GetByDateAndDriver(string date, int driverId);
        Task<ReservationReadResource> GetById(string id);
        Task<Reservation> GetByIdToDelete(string id);
        Task<bool> IsUserOwner(int customerId);
        bool IsKeyUnique(ReservationWriteResource record);
        Task Update(string id, Reservation updatedRecord);
        bool IsOverbooked(string date, int destinationId);
        int GetPortIdFromPickupPointId(ReservationWriteResource record);
        int IsValid(ReservationWriteResource record, IScheduleRepository scheduleRepo);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);
        ReservationWriteResource UpdateForeignKeysWithNull(ReservationWriteResource reservation);
        Task<string> AssignRefNoToNewReservation(ReservationWriteResource record);

    }

}