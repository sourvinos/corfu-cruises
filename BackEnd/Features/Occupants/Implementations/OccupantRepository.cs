namespace BlueWaterCruises.Features.Occupants {

    public class OccupantRepository : Repository<Occupant>, IOccupantRepository {

        public OccupantRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}