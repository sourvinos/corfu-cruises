using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Reservations {

    public interface IReservationReadRepository : IRepository<Reservation> {

        ReservationMappedGroupVM<ReservationMappedListVM> GetForDailyList(string date);
        ReservationMappedGroupVM<ReservationMappedListVM> GetByRefNo(string refNo);
        Task<ReservationDriverGroupVM<Reservation>> GetByDateAndDriver(string date, int driverId);
        Task<Reservation> GetById(string reservationId, bool includeTables);

    }

}