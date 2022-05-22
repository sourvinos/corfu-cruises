using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Interfaces;

namespace API.Features.Embarkation {

    public interface IEmbarkationRepository : IRepository<Reservation> {

        Task<EmbarkationGroupVM<EmbarkationVM>> Get(string date, int destinationId, int portId, string shipId);
        Task<int> GetShipIdFromDescription(string description);
        bool EmbarkSinglePassenger(int id);
        bool EmbarkAllPassengers(int[] id);
    }

}