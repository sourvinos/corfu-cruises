using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CorfuCruises {

    public class DbContext : IdentityDbContext<IdentityUser> {

        public DbContext(DbContextOptions<DbContext> options) : base(options) { }

        public DbSet<Crew> Crews { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<DataEntryPerson> DataEntryPersons { get; set; }
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Gender> Genders { get; set; }
        public DbSet<Nationality> Nationalities { get; set; }
        public DbSet<Occupant> Occupants { get; set; }
        public DbSet<PickupPoint> PickupPoints { get; set; }
        public DbSet<Port> Ports { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<Passenger> Passengers { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<Ship> Ships { get; set; }
        public DbSet<ShipOwner> ShipOwners { get; set; }
        public DbSet<ShipRoute> ShipRoutes { get; set; }
        public DbSet<Token> Tokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Reservation>().Property(x => x.TotalPersons).ValueGeneratedOnAddOrUpdate();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            optionsBuilder.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()));
        }

    }

}