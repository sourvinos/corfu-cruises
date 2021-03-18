namespace CorfuCruises {

    public class OccupantRepository : Repository<Occupant>, IOccupantRepository {

        public OccupantRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}