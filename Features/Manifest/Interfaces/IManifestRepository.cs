using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IManifestRepository {

        IEnumerable<What> Get(string date);

    }

}