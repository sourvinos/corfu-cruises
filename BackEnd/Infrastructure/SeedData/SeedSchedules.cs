using System;
using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Schedules;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Infrastructure.SeedData {

    public static class SeedDatabaseSchedules {

        public static void SeedSchedules(AppDbContext context) {
            if (!context.Schedules.Any()) {
                List<Schedule> schedules = new() {
                    new Schedule { Id = 1, PortId = 1, DestinationId = 1, Date = new DateTime(2021, 10, 01), MaxPersons = 185, IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Schedule { Id = 2, PortId = 2, DestinationId = 1, Date = new DateTime(2021, 10, 01), MaxPersons = 215, IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Schedule { Id = 3, PortId = 1, DestinationId = 3, Date = new DateTime(2021, 10, 02), MaxPersons = 185, IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Schedule { Id = 4, PortId = 2, DestinationId = 1, Date = new DateTime(2021, 10, 03), MaxPersons = 215, IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Schedule { Id = 5, PortId = 1, DestinationId = 1, Date = new DateTime(2021, 10, 10), MaxPersons = 10, IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Schedule { Id = 6, PortId = 1, DestinationId = 1, Date = new DateTime(2025, 01, 01), MaxPersons = 185, IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" }
                };
                context.AddRange(schedules);
                context.SaveChanges();
            }
        }

    }

}