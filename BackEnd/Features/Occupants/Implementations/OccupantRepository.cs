namespace BlueWaterCruises.Features.Occupants {

    public class OccupantRepository : Repository<Occupant>, IOccupantRepository {

        public OccupantRepository(AppDbContext appDbContext) : base(appDbContext) { }

    }

}