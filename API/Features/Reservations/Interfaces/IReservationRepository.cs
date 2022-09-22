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
        Task<Reservation> GetReservation(Guid reservationId, bool trackChanges);
        Task<bool> IsUserOwner(int customerId);
        bool IsKeyUnique(ReservationWriteDto record);
        Task Update(string id, Reservation updatedRecord);
        bool IsOverbooked(string date, int destinationId);
        int GetPortIdFromPickupPointId(ReservationWriteDto record);
        int IsValid(ReservationWriteDto record, IScheduleRepository scheduleRepo);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);
        Task<string> AssignRefNoToNewReservation(ReservationWriteDto record);

    }

}