using System.Threading.Tasks;

namespace API.Features.Embarkation
{

    public interface IEmbarkationRepository {

        Task<EmbarkationFinalGroupVM> Get(string fromDate, string toDate, int[] destinationIds, int[] portIds, int?[] shipIds);
        void EmbarkPassengers(bool ignoreCurrentStatus, int[] ids);
    }

}