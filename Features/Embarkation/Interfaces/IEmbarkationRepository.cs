using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IEmbarkationRepository : IRepository<Reservation> {

        Task<EmbarkationMainResultResource<EmbarkationResource>> Get(string date, int destinationId, int portId, int shipId);
        bool DoEmbarkation(int id);

    }

}