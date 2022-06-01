namespace API.Features.Manifest {

    public interface IManifestRepository {

        ManifestResource Get(string date, int destinationId, string portId, int shipId, int shipRouteId);

    }

}