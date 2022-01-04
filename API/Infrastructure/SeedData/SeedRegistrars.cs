using System.Collections.Generic;
using System.Linq;
using API.Features.Ships.Registrars;
using API.Infrastructure.Classes;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseRegistrars {

        public static void SeedRegistrars(AppDbContext context) {
            if (!context.Registrars.Any()) {
                List<Registrar> registrars = new() {
                    new Registrar { Id = 1, ShipId = 2, Fullname = "WINIFRED GARBER", Phones = "248-462-6749", Email = "ITZEL_CONN@HOTMAIL.COM", Fax = "", Address = "85144 HALLIE FIELD, APT. 817, 47156-3921, JERDEFORT", IsPrimary = false, IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Registrar { Id = 2, ShipId = 2, Fullname = "JOANA NAKAMURA", Phones = "582-333-3698", Email = "JUSTYN9@GMAIL.COM", Fax = "", Address = "37287 PARIS HAVEN, SUITE 316, 97656-6075, GOTTLIEBCHESTER", IsPrimary = true, IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Registrar { Id = 3, ShipId = 2, Fullname = "BRENLEY BOATRIGHT", Phones = "234-880-3925", Email = "XANDER1@YAHOO.COM", Fax = "", Address = "76476 HELENA HARBOR, SUITE 070, 69615, ALEXANDRINEVIEW", IsPrimary = false, IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Registrar { Id = 4, ShipId = 2, Fullname = "LYA OVIEDO", Phones = "404-930-0672", Email = "LIZETH_JONES@HOTMAIL.COM", Fax = "", Address = "125 DECKOW KNOLLS, APT. 834, 55919, NORTH ", IsPrimary = true, IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Registrar { Id = 5, ShipId = 2, Fullname = "CAMILLE VELASQUEZ", Phones = "505-215-8459", Email = "KATTIE.GLOVER76@GMAIL.COM", Fax = "", Address = "191 STEVIE ISLAND, APT. 638, 70932-2776, SHAYNACHESTER", IsPrimary = true, IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Registrar { Id = 6, ShipId = 2, Fullname = "JULIETTE TYLER", Phones = "582-282-1230", Email = "BROOKLYN.BERNHARD9@YAHOO.COM", Fax = "", Address = "700 LINDGREN OVAL, SUITE 216, 47450-2634, ANNAMARIETON", IsPrimary = true, IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" }
                };
                context.AddRange(registrars);
                context.SaveChanges();
            }
        }

    }

}