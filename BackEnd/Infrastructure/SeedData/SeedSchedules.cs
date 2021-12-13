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
                    new Schedule { Id = 1, PortId = 1, DestinationId = 1, Date = new DateTime(2021, 10, 01), MaxPersons = 185, IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() },
                    new Schedule { Id = 2, PortId = 2, DestinationId = 1, Date = new DateTime(2021, 10, 01), MaxPersons = 215, IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() },
                    new Schedule { Id = 3, PortId = 1, DestinationId = 3, Date = new DateTime(2021, 10, 02), MaxPersons = 185, IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() },
                    new Schedule { Id = 4, PortId = 2, DestinationId = 1, Date = new DateTime(2021, 10, 03), MaxPersons = 215, IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() },
                    new Schedule { Id = 5, PortId = 1, DestinationId = 1, Date = new DateTime(2021, 10, 10), MaxPersons = 10, IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() }
                };
                context.AddRange(schedules);
                context.SaveChanges();
            }
        }

    }

}