using System.Threading.Tasks;

namespace API.Features.Embarkation
{

    public interface IEmbarkationRepository {

        Task<EmbarkationFinalGroupVM> GetAsync(string date, int[] destinationIds, int[] portIds, int?[] shipIds);
        void EmbarkPassengers(bool ignoreCurrentStatus, int[] ids);
    }

}