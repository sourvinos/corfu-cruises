namespace CorfuCruises {

    public class ShipOwnerRepository : Repository<ShipOwner>, IShipOwnerRepository {

        public ShipOwnerRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}