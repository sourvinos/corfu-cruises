namespace ShipCruises.Manifest {

    public interface IManifestRepository {

        // IEnumerable<ManifestResource> Get(string date, int shipId, int portId);
        ManifestResource Get(string date, int shipId, int portId);

    }

}