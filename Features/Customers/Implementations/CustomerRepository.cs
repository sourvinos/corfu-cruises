namespace CorfuCruises {

    public class CustomerRepository : Repository<Customer>, ICustomerRepository {

        public CustomerRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}