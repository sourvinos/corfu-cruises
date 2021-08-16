namespace BlueWaterCruises.Features.Ports {

    public class PortRepository : Repository<Port>, IPortRepository {

        public PortRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}