using System.Threading.Tasks;
using ShipCruises.Features.Reservations;

namespace ShipCruises {

    public interface IEmbarkationRepository : IRepository<Reservation> {

        Task<EmbarkationMainResultResource<EmbarkationResource>> Get(string date, int destinationId, int portId, int shipId);
        bool DoEmbarkation(int id);

    }

}