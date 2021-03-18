namespace CorfuCruises {

    public class DestinationRepository : Repository<Destination>, IDestinationRepository {

        public DestinationRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}