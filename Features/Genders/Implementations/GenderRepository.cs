namespace BlueWaterCruises.Features.Genders {

    public class GenderRepository : Repository<Gender>, IGenderRepository {

        public GenderRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}