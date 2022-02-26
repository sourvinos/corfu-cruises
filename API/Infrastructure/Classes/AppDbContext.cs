﻿using API.Features.Customers;
using API.Features.Destinations;
using API.Features.Drivers;
using API.Features.Genders;
using API.Features.Nationalities;
using API.Features.Occupants;
using API.Features.PickupPoints;
using API.Features.Ports;
using API.Features.Registrars;
using API.Features.Reservations;
using API.Features.Routes;
using API.Features.Schedules;
using API.Features.ShipCrews;
using API.Features.ShipOwners;
using API.Features.ShipRoutes;
using API.Features.Ships;
using API.Infrastructure.Auth;
using EntityFramework.Exceptions.MySQL;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Infrastructure.Classes {

    public class AppDbContext : IdentityDbContext<IdentityUser> {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

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
        public DbSet<RefNo> RefNos { get; set; }
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
            ApplyConfigurations(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            optionsBuilder.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()));
            optionsBuilder.UseExceptionProcessor();
        }

        private static void ApplyConfigurations(ModelBuilder modelBuilder) {
            modelBuilder.ApplyConfiguration(new CrewsConfig());
            modelBuilder.ApplyConfiguration(new CustomersConfig());
            modelBuilder.ApplyConfiguration(new DestinationsConfig());
            modelBuilder.ApplyConfiguration(new DriversConfig());
            modelBuilder.ApplyConfiguration(new GendersConfig());
            modelBuilder.ApplyConfiguration(new NationalitiesConfig());
            modelBuilder.ApplyConfiguration(new OccupantsConfig());
            modelBuilder.ApplyConfiguration(new PassengersConfig());
            modelBuilder.ApplyConfiguration(new PickupPointsConfig());
            modelBuilder.ApplyConfiguration(new PortsConfig());
            modelBuilder.ApplyConfiguration(new RefNosConfig());
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