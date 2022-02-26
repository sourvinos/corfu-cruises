using System.Threading.Tasks;
using API.Features.Schedules;
using API.Infrastructure.Interfaces;

namespace API.Features.Reservations {

    public interface IReservationRepository : IRepository<Reservation> {

        Task<ReservationGroupResource<ReservationListResource>> GetByDate(string date);
        Task<ReservationGroupResource<ReservationListResource>> GetByRefNo(string refNo);
        Task<ReservationReadResource> GetById(string id);
        Task<Reservation> GetByIdToDelete(string id);
        Task<bool> DoesUserOwnRecord(string userId);
        bool IsKeyUnique(ReservationWriteResource record);
        bool Update(string id, Reservation updatedRecord);
        int GetPortIdFromPickupPointId(ReservationWriteResource record);
        int IsValid(ReservationWriteResource record, IScheduleRepository scheduleRepo);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);
        ReservationWriteResource UpdateForeignKeysWithNull(ReservationWriteResource reservation);
        string AssignRefNoToNewReservation(ReservationWriteResource record);

    }

}