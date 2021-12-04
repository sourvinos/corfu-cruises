using System.Threading.Tasks;
using BlueWaterCruises.Features.Schedules;

namespace BlueWaterCruises.Features.Reservations {

    public interface IReservationRepository : IRepository<Reservation> {

        Task<ReservationGroupResource<ReservationListResource>> Get(string date, string userId);
        Task<ReservationReadResource> GetById(string userId, string id);
        Task<Reservation> GetByIdToDelete(string id);
        Task<bool> UserIsAdmin(string userId);
        Task<bool> UserOwnsRecord(ReservationWriteResource record);
        bool IsKeyUnique(ReservationWriteResource record);
        bool Update(string id, Reservation updatedRecord);
        int IsValid(ReservationWriteResource record, IScheduleRepository scheduleRepo);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);

    }

}