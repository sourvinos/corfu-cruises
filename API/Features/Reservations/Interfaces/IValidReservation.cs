using System.Threading.Tasks;
using API.Features.Schedules;
using API.Infrastructure.Interfaces;

namespace API.Features.Reservations {

    public interface IValidReservation : IRepository<Reservation> {

        Task<bool> IsUserOwner(int customerId);
        bool IsKeyUnique(ReservationWriteDto record);
        bool IsOverbooked(string date, int destinationId);
        int GetPortIdFromPickupPointId(ReservationWriteDto record);
        int IsValid(ReservationWriteDto record, IScheduleRepository scheduleRepo);

    }

}