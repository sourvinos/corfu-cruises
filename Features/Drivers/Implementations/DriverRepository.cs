namespace ShipCruises {

    public class DriverRepository : Repository<Driver>, IDriverRepository {

        public DriverRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}