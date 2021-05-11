using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IManifestRepository {

        Task<IEnumerable<ManifestResource>> Get(string dateIn);

    }

}