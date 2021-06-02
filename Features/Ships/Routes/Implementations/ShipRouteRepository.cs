namespace CorfuCruises {

    public class ShipRouteRepository : Repository<ShipRoute>, IShipRouteRepository {

        public ShipRouteRepository(DbContext context) : base(context) { }

    }

}