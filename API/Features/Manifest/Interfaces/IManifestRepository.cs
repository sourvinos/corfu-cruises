namespace API.Features.Manifest {

    public interface IManifestRepository {

        ManifestVM Get(string date, int destinationId, int shipId, int[] portIds);

    }

}