using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Interfaces;

namespace API.Features.Embarkation {

    public interface IEmbarkationRepository : IRepository<Reservation> {

        Task<EmbarkationGroupVM<EmbarkationVM>> Get(string date, string destinationId, string portId, string shipId);
        Task<Passenger> GetPassengerById(int id);
        Task<int> GetShipIdFromDescription(string description);
        void EmbarkSinglePassenger(int id);
        void EmbarkAllPassengers(int[] id);
    }

}