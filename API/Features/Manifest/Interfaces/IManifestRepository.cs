namespace API.Features.Manifest {

    public interface IManifestRepository {

        ManifestResource Get(string date, int destinationId, int portId, int shipId, int shipRouteId);

    }

}