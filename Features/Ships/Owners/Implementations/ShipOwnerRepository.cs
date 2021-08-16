namespace BlueWaterCruises.Features.Ships {

    public class ShipOwnerRepository : Repository<ShipOwner>, IShipOwnerRepository {

        public ShipOwnerRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}