namespace CorfuCruises {

    public class ShipRepository : Repository<Ship>, IShipRepository {

        public ShipRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}