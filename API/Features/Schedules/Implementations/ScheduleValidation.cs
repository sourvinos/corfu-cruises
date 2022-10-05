using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Schedules {

    public class ScheduleValidation : Repository<Schedule>, IScheduleValidation {

        public ScheduleValidation(AppDbContext context, IOptions<TestingEnvironment> settings) : base(context, settings) { }

        public int IsValidOnNew(List<ScheduleWriteDto> schedules) {
            return true switch {
                var x when x == !IsValidDestinationOnNew(schedules) => 451,
                var x when x == !IsValidPortOnNew(schedules) => 411,
                _ => 200,
            };
        }

        public int IsValidOnUpdate(ScheduleWriteDto record) {
            return true switch {
                var x when x == !IsValidDestinationOnUpdate(record) => 451,
                var x when x == !IsValidPortOnUpdate(record) => 411,
                _ => 200,
            };
        }

        private bool IsValidDestinationOnNew(List<ScheduleWriteDto> schedules) {
            if (schedules != null) {
                foreach (var schedule in schedules) {
                    if (context.Destinations
                        .AsNoTracking()
                        .SingleOrDefault(x => x.Id == schedule.DestinationId && x.IsActive) == null) return false;
                }
            }
            return true;
        }

        private bool IsValidDestinationOnUpdate(ScheduleWriteDto record) {
            return context.Destinations.SingleOrDefault(x => x.Id == record.DestinationId) != null;
        }

        private bool IsValidPortOnNew(List<ScheduleWriteDto> schedules) {
            if (schedules != null) {
                foreach (var schedule in schedules) {
                    if (context.Ports
                        .AsNoTracking()
                        .SingleOrDefault(x => x.Id == schedule.PortId && x.IsActive) == null) return false;
                }
            }
            return true;
        }

        private bool IsValidPortOnUpdate(ScheduleWriteDto record) {
            return context.Ports.SingleOrDefault(x => x.Id == record.PortId) != null;
        }

    }

}