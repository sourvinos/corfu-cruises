using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IManifestRepository {

        IEnumerable<ManifestViewModel> Get(string date, int shipId, int shipRouteId);

    }

}