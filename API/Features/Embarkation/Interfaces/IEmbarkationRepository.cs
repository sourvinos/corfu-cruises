using System.Threading.Tasks;
using API.Features.Reservations;

namespace API.Features.Embarkation {

    public interface IEmbarkationRepository {

        Task<EmbarkationMappedGroupVM<EmbarkationMappedVM>> Get(string date, string destinationId, string portId, string shipId);
        Task<Passenger> GetPassengerById(int id);
        void EmbarkPassenger(int id);
        void EmbarkPassengers(int[] ids);
    }

}