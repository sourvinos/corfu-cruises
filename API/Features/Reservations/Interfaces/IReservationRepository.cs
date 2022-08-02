using System.Threading.Tasks;
using API.Features.Schedules;
using API.Infrastructure.Interfaces;

namespace API.Features.Reservations {

    public interface IReservationRepository : IRepository<Reservation> {

        Task<ReservationDto<ReservationListDto>> GetByDate(string date);
        Task<ReservationDto<ReservationListDto>> GetByRefNo(string refNo);
        Task<DriverDto<Reservation>> GetByDateAndDriver(string date, int driverId);
        Task<ReservationReadDto> GetById(string id);
        Task<Reservation> GetByIdToDelete(string id);
        Task<bool> IsUserOwner(int customerId);
        bool IsKeyUnique(ReservationWriteDto record);
        Task Update(string id, Reservation updatedRecord);
        bool IsOverbooked(string date, int destinationId);
        Task<int> GetPortIdFromPickupPointId(ReservationWriteDto record);
        Task<int> IsValidAsync(ReservationWriteDto record, IScheduleRepository scheduleRepo);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);
        ReservationWriteDto UpdateForeignKeysWithNull(ReservationWriteDto reservation);
        Task<string> AssignRefNoToNewReservation(ReservationWriteDto record);

    }

}