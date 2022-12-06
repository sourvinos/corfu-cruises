namespace API.Features.Manifest {

    public interface IManifestRepository {

        // IEnumerable<ManifestVM> Get(string date, int destinationId, int shipId, int[] portIds);
        ManifestVM Get(string date, int destinationId, int shipId, int[] portIds);

    }

}