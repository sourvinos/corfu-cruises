using BlueWaterCruises;
using Microsoft.AspNetCore.Identity;

public static class SeedDatabaseMaster {

    public static void SeedDatabase(RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager, AppDbContext context) {
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
    }

}