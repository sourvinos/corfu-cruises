using API.Infrastructure.Classes;
using API.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseMaster {

        public static void SeedDatabase(RoleManager<IdentityRole> roleManager, UserManager<UserExtended> userManager, AppDbContext context) {
            // context.Database.EnsureDeleted();
            // context.Database.EnsureCreated();
            // Identity
            SeedDatabaseRoles.SeedRoles(roleManager);
            SeedDatabaseUsers.SeedUsers(userManager);
            // Standalone
            SeedDatabaseCustomers.SeedCustomers(context);
            SeedDatabaseDestinations.SeedDestinations(context);
            SeedDatabaseDrivers.SeedDrivers(context);
            SeedDatabaseGenders.SeedGenders(context);
            SeedDatabaseNationalities.SeedNationalities(context);
            SeedDatabaseOccupants.SeedOccupants(context);
            SeedDatabasePorts.SeedPorts(context);
            SeedDatabaseRefNos.SeedRefNos(context);
            SeedDatabaseShipOwners.SeedShipOwners(context);
            SeedDatabaseShipRoutes.SeedShipRoutes(context);
            // With dependencies on other tables
            SeedDatabasePickupPoints.SeedPickupPoints(context);
            SeedDatabaseRegistrars.SeedRegistrars(context);
            SeedDatabaseRoutes.SeedCoachRoutes(context);
            SeedDatabaseSchedules.SeedSchedules(context);
            SeedDatabaseShipCrews.SeedShipCrews(context);
            SeedDatabaseShips.SeedShips(context);
            // Reservations
            SeedDatabaseReservations.SeedReservations(context);
            SeedDatabasePassengers.SeedPassengers(context);
        }

    }

}