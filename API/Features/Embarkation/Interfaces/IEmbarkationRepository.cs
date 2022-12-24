using System.Threading.Tasks;
using API.Features.Reservations;

namespace API.Features.Embarkation {

    public interface IEmbarkationRepository {

        Task<EmbarkationFinalGroupVM> GetAsync(string date, int[] destinationIds, int[] portIds, int?[] shipIds);
        Task<Passenger> GetPassengerByIdAsync(int id);
        void EmbarkPassenger(int id);
        void EmbarkPassengers(int[] ids);
    }

}