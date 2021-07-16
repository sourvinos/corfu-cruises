namespace ShipCruises {

    public class ShipRouteRepository : Repository<ShipRoute>, IShipRouteRepository {

        public ShipRouteRepository(DbContext context) : base(context) { }

    }

}