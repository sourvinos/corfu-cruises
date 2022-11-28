using System.Collections.Generic;
using System.Linq;

namespace API.Features.Manifest {

    public interface IManifestRepository {

        IEnumerable<Boo> Get(string date, int destinationId, int shipId, int[] portIds);

    }

}