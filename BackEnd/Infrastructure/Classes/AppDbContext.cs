using BlueWaterCruises.Features.Crews;
using BlueWaterCruises.Features.Customers;
using BlueWaterCruises.Features.Destinations;
using BlueWaterCruises.Features.Drivers;
using BlueWaterCruises.Features.Genders;
using BlueWaterCruises.Features.Nationalities;
using BlueWaterCruises.Features.Occupants;
using BlueWaterCruises.Features.PickupPoints;
using BlueWaterCruises.Features.Ports;
using BlueWaterCruises.Features.Registrars;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Features.Routes;
using BlueWaterCruises.Features.Schedules;
using BlueWaterCruises.Features.ShipRoutes;
using BlueWaterCruises.Features.Ships;
using BlueWaterCruises.FluentApi;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises {

    public class AppDbContext : IdentityDbContext<IdentityUser> {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public AppDbContext() {
        }

        #region DbSets

        public DbSet<Crew> Crews { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Gender> Genders { get; set; }
        public DbSet<Nationality> Nationalities { get; set; }
        public DbSet<Occupant> Occupants { get; set; }
        public DbSet<Passenger> Passengers { get; set; }
        public DbSet<PickupPoint> PickupPoints { get; set; }
        public DbSet<Port> Ports { get; set; }
        public DbSet<Registrar> Registrars { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<Ship> Ships { get; set; }
        public DbSet<ShipOwner> ShipOwners { get; set; }
        public DbSet<ShipRoute> ShipRoutes { get; set; }
        public DbSet<Token> Tokens { get; set; }

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);
            this.ApplyConfigurations(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            optionsBuilder.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()));
        }

        private void ApplyConfigurations(ModelBuilder modelBuilder) {
            modelBuilder.ApplyConfiguration(new CrewsConfig());
            modelBuilder.ApplyConfiguration(new CustomersConfig());
            modelBuilder.ApplyConfiguration(new DestinationsConfig());
            modelBuilder.ApplyConfiguration(new DriversConfig());
            modelBuilder.ApplyConfiguration(new GendersConfig());
            modelBuilder.ApplyConfiguration(new NationalitiesConfig());
            modelBuilder.ApplyConfiguration(new OccupantsConfig());
            modelBuilder.ApplyConfiguration(new PickupPointsConfig());
            modelBuilder.ApplyConfiguration(new PortsConfig());
            modelBuilder.ApplyConfiguration(new RegistrarsConfig());
            modelBuilder.ApplyConfiguration(new ReservationsConfig());
            modelBuilder.ApplyConfiguration(new RoutesConfig());
            modelBuilder.ApplyConfiguration(new SchedulesConfig());
            modelBuilder.ApplyConfiguration(new ShipOwnersConfig());
            modelBuilder.ApplyConfiguration(new ShipRoutesConfig());
            modelBuilder.ApplyConfiguration(new ShipsConfig());
        }

    }

}