namespace CorfuCruises {

    public class NationalityRepository : Repository<Nationality>, INationalityRepository {

        public NationalityRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}