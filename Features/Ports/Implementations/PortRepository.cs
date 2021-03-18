namespace CorfuCruises {

    public class PortRepository : Repository<Port>, IPortRepository {

        public PortRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}