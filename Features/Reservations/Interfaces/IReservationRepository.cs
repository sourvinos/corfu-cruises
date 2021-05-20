using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CorfuCruises {

    public interface IReservationRepository : IRepository<Reservation> {

        Task<ReservationGroupReadResource<ReservationReadResource>> Get(string userId, string dateIn);
        IEnumerable<MainResult> GetForDestination(int destinationId);
        ReservationTotalPersons GetForDateAndDestinationAndPort(string date, int destinationId, int portId);
        Task<Reservation> GetById(string id);
        byte[] PrintVoucher(Voucher voucher);
        bool Update(string id, Reservation updatedRecord);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);

    }

}