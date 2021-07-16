using System.Threading.Tasks;

namespace ShipCruises {

    public interface IWebRepository : IRepository<Reservation> {

        ReservationTotalPersons GetForDateDestinationPort(string date, int destinationId, int portId);
        Task<Reservation> GetById(string id);
        bool Update(string id, Reservation updatedRecord);

    }

}