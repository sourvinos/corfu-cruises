using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Reservations {

    public interface IReservationReadRepository : IRepository<Reservation> {

        ReservationFinalGroupVM GetForDailyList(string date);
        ReservationFinalGroupVM GetByRefNo(string refNo);
        Task<ReservationDriverGroupVM> GetByDateAndDriver(string date, int driverId);
        Task<Reservation> GetById(string reservationId, bool includeTables);

    }

}