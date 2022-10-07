using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Reservations {

    public interface IReservationRepository : IRepository<Reservation> {

        IEnumerable<ReservationCalendarGroupVM> GetForCalendar(string fromDate, string toDate);
        Task<ReservationMappedGroupVM<ReservationMappedListVM>> GetForDailyList(string date);
        Task<ReservationMappedGroupVM<ReservationMappedListVM>> GetByRefNo(string refNo);
        Task<ReservationDriverGroupVM<Reservation>> GetByDateAndDriver(string date, int driverId);
        Task<Reservation> GetById(string reservationId, bool includeTables);
        Task Update(string id, Reservation updatedRecord);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);
        Task<string> AssignRefNoToNewReservation(ReservationWriteDto reservation);
        ReservationWriteDto AttachUserIdToDto(ReservationWriteDto reservation);

    }

}