using System.Linq;
using API.Features.Reservations;
using API.Infrastructure.Classes;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseRefNos {

        public static void SeedRefNos(AppDbContext context) {
            if (!context.RefNos.Any()) {
                RefNo refNo = new() {
                    Id = 1,
                    LastRefNo = 50
                };
                context.Add(refNo);
                context.SaveChanges();
            }
        }

    }

}