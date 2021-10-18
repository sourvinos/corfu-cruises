using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Features.Schedules;

namespace BlueWaterCruises.Features.Reservations {

    public interface IReservationRepository : IRepository<Reservation> {

        IEnumerable<ReservationResource> GetForPeriod(string fromDate, string toDate);
        Task<Reservation> GetSingleToDelete(string id);
        Task<ReservationGroupResource<ReservationListResource>> GetForDate(string date);
        Task<ReservationReadResource> GetSingle(string id);
        bool IsKeyUnique(ReservationWriteResource record);
        bool Update(string id, Reservation updatedRecord);
        int IsValid(ReservationWriteResource record, IScheduleRepository scheduleRepo);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);

    }

}