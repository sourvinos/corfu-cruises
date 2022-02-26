using API.Infrastructure.Classes;
using API.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseMaster {

        public static void SeedDatabase(RoleManager<IdentityRole> roleManager, UserManager<UserExtended> userManager, AppDbContext context) {
            // context.Database.EnsureDeleted();
            // context.Database.EnsureCreated();
            SeedDatabaseRoles.SeedRoles(roleManager);
            SeedDatabaseUsers.SeedUsers(userManager);
            SeedDatabaseCustomers.SeedCustomers(context);
            SeedDatabaseDestinations.SeedDestinations(context);
            SeedDatabaseDrivers.SeedDrivers(context);
            SeedDatabaseGenders.SeedGenders(context);
            SeedDatabaseNationalities.SeedNationalities(context);
            SeedDatabaseOccupants.SeedOccupants(context);
            SeedDatabasePorts.SeedPorts(context);
            SeedDatabaseRoutes.SeedRoutes(context);
            SeedDatabasePickupPoints.SeedPickupPoints(context);
            SeedDatabaseShipRoutes.SeedShipRoutes(context);
            SeedDatabaseShipOwners.SeedShipOwners(context);
            SeedDatabaseShips.SeedShips(context);
            SeedDatabaseRegistrars.SeedRegistrars(context);
            SeedDatabaseCrews.SeedCrews(context);
            SeedDatabaseSchedules.SeedSchedules(context);
            SeedDatabaseReservations.SeedReservations(context);
            SeedDatabasePassengers.SeedPassengers(context);
            SeedDatabaseRefNos.SeedRefNos(context);
        }

    }

}