using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Customers;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Infrastructure.SeedData {

    public static class SeedDatabaseCustomers {

        public static void SeedCustomers(AppDbContext context) {
            if (!context.Customers.Any()) {
                List<Customer> customers = new() {
                    new Customer { Id = 01, Description = "SCHULTZ LLC", Profession = "FINANCIAL ANALYST", Address = "35417 JERMAINE SHOAL, SUITE 591, 07435, SOUTH RICK", Phones = "406-933-0135", PersonInCharge = "KALE", Email = "ELSIE.KUTCH20@GMAIL.COM", IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Customer { Id = 02, Description = "FEIL, KILBACK AND HALEY", Profession = "NUCLEAR POWER REACTOR OPERATOR", Address = "03479 NOLAN PIKE, APT. 426, 51929-4205, LAKE GERARDO", Phones = "406-933-0135", PersonInCharge = "DION", Email = "ITZEL_CONN@HOTMAIL.COM", IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Customer { Id = 03, Description = "BEER INC", Profession = "SAFE REPAIRER", Address = "9337 ROLFSON MANORS, SUITE 765, 74420, PORT MYRONSHIRE", Phones = "582-282-1230", PersonInCharge = "PAYTON", Email = "BROOKLYN.BERNHARD9@YAHOO.COM", IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Customer { Id = 04, Description = "HAGENES INC", Profession = "LOCKER ROOM ATTENDANT", Address = "0426 PFANNERSTILL LIGHTS, APT. 695, 74155, GLENDABOROUGH", Phones = "582-282-1230", PersonInCharge = "PAIGE", Email = "POLLY_SHANAHAN@GMAIL.COM", IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Customer { Id = 05, Description = "BARTELL, PFEFFER AND JACOBI", Profession = "CLEANER", Address = "05106 AUER MISSION, SUITE 635, 40457, LAKE FATIMA", Phones = "214-695-9090", PersonInCharge = "ESTELLA", Email = "NEOMA11@GMAIL.COM", IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Customer { Id = 06, Description = "MARQUARDT - BOYLE", Profession = "SALES MANAGER", Address = "7276 ANDREW FORGE, APT. 847, 69177-1589, NEW DOMINIQUECHESTER", Phones = "248-462-6749", PersonInCharge = "BURNICE", Email = "EMIL_LUEILWITZ@GMAIL.COM", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Customer { Id = 07, Description = "GREEN - PREDOVIC", Profession = "MANICURIST", Address = "700 LINDGREN OVAL, SUITE 216, 47450-2634, ANNAMARIETON", Phones = "213-530-3580", PersonInCharge = "KIRK", Email = "LENNIE_KUVALIS@YAHOO.COM", IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Customer { Id = 08, Description = "GREEN - HAND", Profession = "HEAT TREATING EQUIPMENT SETTER", Address = "9182 ROXANE LANDING, SUITE 564, 62630-4595, LAKE RASHAWN", Phones = "214-568-7608", PersonInCharge = "BURNICE", Email = "JANESSA95@HOTMAIL.COM", IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Customer { Id = 09, Description = "BEER INC", Profession = "PAPER GOODS MACHINE SETTER", Address = "483 KENNETH DALE, SUITE 251, 37537-7686, ALLYLAND", Phones = "220-810-6831", PersonInCharge = "COLUMBUS", Email = "ITZEL_CONN@HOTMAIL.COM", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Customer { Id = 10, Description = "GREEN - HAND", Profession = "FINANCIAL ANALYST", Address = "0165 GULGOWSKI CLUB, SUITE 197, 32119-3361, NORTH EVERETTVIEW", Phones = "304-923-1193", PersonInCharge = "MARK", Email = "MERLE_LANGWORTH@GMAIL.COM", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Customer { Id = 11, Description = "WILLMS - VOLKMAN", Profession = "METAL CASTER", Address = "4517 LEBSACK SHOAL, SUITE 291, 01861, EAST JOHANNABURGH", Phones = "214-695-9090", PersonInCharge = "CASANDRA", Email = "AMINA_FRAMI@YAHOO.COM", IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Customer { Id = 12, Description = "SCHUPPE LLC", Profession = "LAUNDRY WORKER", Address = "55163 ERNEST LODGE, SUITE 817, 20221, MCCULLOUGHCHESTER", Phones = "582-400-6729", PersonInCharge = "COLUMBUS", Email = "ITZEL_CONN@HOTMAIL.COM", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Customer { Id = 13, Description = "CROOKS INCMANN - TRANTOW", Profession = "TEAM ASSEMBLER", Address = "99649 MADELINE WALK, APT. 371, 85445-5635, ANTONETTABOROUGH", Phones = "582-282-0704", PersonInCharge = "LINNEA", Email = "BROCK37@HOTMAIL.COM", IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Customer { Id = 14, Description = "BEIER GROUP", Profession = "LOCKSMITH", Address = "571 LINDSEY ISLAND, APT. 220, 91380-5078, NORTH GAY", Phones = "582-333-3698", PersonInCharge = "BOBBIE", Email = "DUNCAN.OCONNELL44@YAHOO.COM", IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Customer { Id = 15, Description = "BEIER GROUP", Profession = "RENTAL CLERK", Address = "855 GOYETTE SPRING, APT. 614, 98267, ANAHIBOROUGH", Phones = "505-635-2346", PersonInCharge = "TOREY", Email = "XANDER1@YAHOO.COM", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Customer { Id = 16, Description = "GREEN - PREDOVIC", Profession = "SHIP CAPTAIN", Address = "1572 LEGROS UNION, SUITE 759, 23704-6192, KOELPINVILLE", Phones = "213-530-3580", PersonInCharge = "MYRNA", Email = "JEROD_COLLIER17@HOTMAIL.COM", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Customer { Id = 17, Description = "BARROWS, KOHLER AND WEISSNAT", Profession = "SALES MANAGER", Address = "37287 PARIS HAVEN, SUITE 316, 97656-6075, GOTTLIEBCHESTER", Phones = "214-695-9090", PersonInCharge = "GILES", Email = "JOHNNY.LABADIE65@HOTMAIL.COM", IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Customer { Id = 18, Description = "VON, HEANEY AND DANIEL", Profession = "PARALEGAL", Address = "5803 SKYLA TURNPIKE, SUITE 376, 19889-2760, DELPHIAFURT", Phones = "609-790-8062", PersonInCharge = "VLADIMIR", Email = "MATT.LITTEL92@YAHOO.COM", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Customer { Id = 19, Description = "SCHUMM INC", Profession = "CLEANER", Address = "85144 HALLIE FIELD, APT. 817, 47156-3921, JERDEFORT", Phones = "582-333-3698", PersonInCharge = "BURNICE", Email = "CARLOS61@HOTMAIL.COM", IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Customer { Id = 20, Description = "GREEN - HAND", Profession = "HOME MANAGEMENT ADVISOR", Address = "0426 PFANNERSTILL LIGHTS, APT. 695, 74155, GLENDABOROUGH", Phones = "248-462-6749", PersonInCharge = "LAUREL", Email = "KATTIE.GLOVER76@GMAIL.COM", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" }
                };
                context.AddRange(customers);
                context.SaveChanges();
            }
        }

    }

}