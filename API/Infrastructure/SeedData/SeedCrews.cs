using System;
using System.Collections.Generic;
using System.Linq;
using API.Features.ShipsCrews;
using API.Infrastructure.Classes;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseCrews {

        public static void SeedCrews(AppDbContext context) {
            if (!context.Crews.Any()) {
                List<Crew> crews = new() {
                    new Crew { Id = 1, ShipId = 2, NationalityId = 150, GenderId = 1, Lastname = "EYAD", Firstname = "LEMASTER", Birthdate = new DateTime(1975, 12, 21), IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Crew { Id = 2, ShipId = 2, NationalityId = 71, GenderId = 1, Lastname = "BRUCE", Firstname = "TROWBRIDGE", Birthdate = new DateTime(2011, 11, 23), IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Crew { Id = 3, ShipId = 2, NationalityId = 132, GenderId = 3, Lastname = "ZYMIR", Firstname = "LACASSE", Birthdate = new DateTime(2019, 08, 09), IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Crew { Id = 4, ShipId = 2, NationalityId = 17, GenderId = 3, Lastname = "LAVON", Firstname = "GRINER", Birthdate = new DateTime(1992, 09, 18), IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Crew { Id = 5, ShipId = 2, NationalityId = 62, GenderId = 1, Lastname = "DARIANNA", Firstname = "MCFADDEN", Birthdate = new DateTime(1990, 08, 01), IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Crew { Id = 6, ShipId = 1, NationalityId = 218, GenderId = 1, Lastname = "FERN", Firstname = "SHOCKEY", Birthdate = new DateTime(1978, 11, 24), IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Crew { Id = 7, ShipId = 2, NationalityId = 133, GenderId = 3, Lastname = "LACI", Firstname = "HAHN", Birthdate = new DateTime(2018, 01, 20), IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Crew { Id = 8, ShipId = 2, NationalityId = 224, GenderId = 2, Lastname = "BETTY", Firstname = "CUTLER", Birthdate = new DateTime(2017, 11, 09), IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Crew { Id = 9, ShipId = 1, NationalityId = 118, GenderId = 2, Lastname = "DEEN", Firstname = "FORT", Birthdate = new DateTime(1993, 12, 22), IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Crew { Id = 10, ShipId = 1, NationalityId = 135, GenderId = 2, Lastname = "CONSTANCE", Firstname = "OTTINGER", Birthdate = new DateTime(1992, 12, 18), IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Crew { Id = 11, ShipId = 2, NationalityId = 26, GenderId = 2, Lastname = "AEDAN", Firstname = "PINKERTON", Birthdate = new DateTime(1977, 04, 20), IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Crew { Id = 12, ShipId = 2, NationalityId = 253, GenderId = 3, Lastname = "AFTON", Firstname = "NAKAMURA", Birthdate = new DateTime(1991, 03, 12), IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Crew { Id = 13, ShipId = 1, NationalityId = 128, GenderId = 3, Lastname = "TINLEY", Firstname = "DUCKWORTH", Birthdate = new DateTime(1976, 01, 24), IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Crew { Id = 14, ShipId = 1, NationalityId = 208, GenderId = 3, Lastname = "SOL", Firstname = "NICKELL", Birthdate = new DateTime(1991, 07, 19), IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Crew { Id = 15, ShipId = 2, NationalityId = 127, GenderId = 3, Lastname = "ALDER", Firstname = "SOKOL", Birthdate = new DateTime(2008, 04, 14), IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Crew { Id = 16, ShipId = 2, NationalityId = 192, GenderId = 1, Lastname = "KERRINGTON", Firstname = "CAMPA", Birthdate = new DateTime(2000, 08, 24), IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Crew { Id = 17, ShipId = 2, NationalityId = 170, GenderId = 3, Lastname = "ANALEE", Firstname = "RUBLE", Birthdate = new DateTime(1991, 07, 05), IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Crew { Id = 18, ShipId = 2, NationalityId = 3, GenderId = 1, Lastname = "AVALEIGH", Firstname = "CUTLER", Birthdate = new DateTime(1995, 01, 12), IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Crew { Id = 19, ShipId = 1, NationalityId = 132, GenderId = 2, Lastname = "AINSLEIGH", Firstname = "GLASSER", Birthdate = new DateTime(2001, 01, 23), IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Crew { Id = 20, ShipId = 2, NationalityId = 84, GenderId = 3, Lastname = "NIKAYLA", Firstname = "LUNDY", Birthdate = new DateTime(1994, 10, 27), IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" }
                };
                context.AddRange(crews);
                context.SaveChanges();
            }
        }

    }

}