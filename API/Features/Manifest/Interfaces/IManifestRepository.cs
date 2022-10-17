namespace API.Features.Manifest {

    public interface IManifestRepository {

        ManifestFinalVM Get(string date, int destinationId, string portId, int shipId, int shipRouteId);

    }

}