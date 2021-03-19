using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IBookingRepository : IRepository<Booking> {

        Task<BookingGroupResultResource<BookingResource>> Get(string dateIn);
        IEnumerable<BookingPerDestinationAndPort> GetForDestinationAndPort(int destinationId, int portId);
        new Task<Booking> GetById(int id);
        void UpdateWithDetails(int id, Booking updatedRecord);
        void AssignToDriver(int driverId, int[] ids);
        void AssignToShip(int shipId, int[] ids);

    }

}