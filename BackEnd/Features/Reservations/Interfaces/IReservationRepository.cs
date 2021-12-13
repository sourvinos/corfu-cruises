using System.Threading.Tasks;
using BlueWaterCruises.Features.Schedules;
using BlueWaterCruises.Infrastructure.Interfaces;

namespace BlueWaterCruises.Features.Reservations {

    public interface IReservationRepository : IRepository<Reservation> {

        Task<ReservationGroupResource<ReservationListResource>> Get(string date);
        Task<ReservationReadResource> GetById(string id);
        Task<Reservation> GetByIdToDelete(string id);
        Task<bool> DoesUserOwnRecord(string reservationId);
        bool IsKeyUnique(ReservationWriteResource record);
        bool Update(string id, Reservation updatedRecord);
        int IsValid(ReservationWriteResource record, IScheduleRepository scheduleRepo);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);

    }

}