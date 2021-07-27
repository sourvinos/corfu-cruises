namespace ShipCruises.Manifest {

    public interface IManifestRepository {

        ManifestResource Get(string date, int shipId, int portId);

    }

}