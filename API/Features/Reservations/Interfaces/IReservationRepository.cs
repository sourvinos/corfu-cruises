using System;
using System.Threading.Tasks;
using API.Features.Schedules;
using API.Infrastructure.Interfaces;

namespace API.Features.Reservations {

    public interface IReservationRepository : IRepository<Reservation> {

        Task<ReservationGroupVM<ReservationListVM>> GetByDate(string date);
        Task<ReservationGroupVM<ReservationListVM>> GetByRefNo(string refNo);
        Task<ReservationDriverGroupVM<Reservation>> GetByDateAndDriver(string date, int driverId);
        Task<Reservation> GetById(string id);
        Task<Reservation> IsFound(Guid reservationId, bool trackChanges);
        Task Update(string id, Reservation updatedRecord);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);
        Task<string> AssignRefNoToNewReservation(ReservationWriteDto record);

    }

}