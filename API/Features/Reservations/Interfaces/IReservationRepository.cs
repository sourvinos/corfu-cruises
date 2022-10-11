using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Reservations {

    public interface IReservationRepository : IRepository<Reservation> {

        Task<ReservationMappedGroupVM<ReservationMappedListVM>> GetForDailyList(string date);
        Task<ReservationMappedGroupVM<ReservationMappedListVM>> GetByRefNo(string refNo);
        Task<ReservationDriverGroupVM<Reservation>> GetByDateAndDriver(string date, int driverId);
        Task<Reservation> GetById(string reservationId, bool includeTables);
        Task Update(string id, Reservation updatedRecord);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);
        Task<string> AssignRefNoToNewDto(ReservationWriteDto reservation);
        ReservationWriteDto AttachUserIdToDto(ReservationWriteDto reservation);

    }

}