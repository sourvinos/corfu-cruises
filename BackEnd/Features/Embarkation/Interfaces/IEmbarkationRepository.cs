using System.Threading.Tasks;
using BlueWaterCruises.Features.Reservations;

namespace BlueWaterCruises.Features.Embarkation {

    public interface IEmbarkationRepository : IRepository<Reservation> {

        Task<EmbarkationMainResultResource<EmbarkationResource>> Get(string date, int destinationId, int portId, int shipId);
        bool DoEmbarkation(int id);

    }

}