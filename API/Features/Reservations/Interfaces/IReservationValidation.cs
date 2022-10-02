using System.Threading.Tasks;
using API.Features.Schedules;

namespace API.Features.Reservations {

    public interface IReservationValidation {

        Task<bool> IsUserOwner(int customerId);
        bool IsKeyUnique(ReservationWriteDto record);
        bool IsOverbooked(string date, int destinationId);
        int GetPortIdFromPickupPointId(ReservationWriteDto record);
        int IsValid(ReservationWriteDto record, IScheduleRepository scheduleRepo);

    }

}