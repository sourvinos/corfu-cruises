using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Interfaces;

namespace API.Features.Embarkation {

    public interface IEmbarkationRepository : IRepository<Reservation> {

        Task<EmbarkationMainResultResource<EmbarkationResource>> Get(string date, int destinationId, int portId, string shipId);
        bool DoEmbarkation(int id);

    }

}