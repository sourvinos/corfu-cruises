using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using Microsoft.Extensions.Options;

namespace API.Features.Schedules {

    public class ScheduleValidation : Repository<Schedule>, IScheduleValidation {

        public ScheduleValidation(AppDbContext context, IOptions<TestingEnvironment> settings) : base(context, settings) { }

        public int IsValidOnNew(List<ScheduleWriteDto> records) {
            return true switch {
                var x when x == !IsValidDestinationOnNew(records) => 451,
                var x when x == !IsValidPortOnNew(records) => 411,
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
                bool isValid = false;
                foreach (var schedule in schedules) {
                    isValid = context.Destinations.SingleOrDefault(x => x.Id == schedule.DestinationId && x.IsActive) != null;
                }
                return schedules.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidDestinationOnUpdate(ScheduleWriteDto record) {
            return context.Destinations.SingleOrDefault(x => x.Id == record.DestinationId) != null;
        }

        private bool IsValidPortOnNew(List<ScheduleWriteDto> schedules) {
            if (schedules != null) {
                bool isValid = false;
                foreach (var schedule in schedules) {
                    isValid = context.Ports.SingleOrDefault(x => x.Id == schedule.PortId && x.IsActive) != null;
                }
                return schedules.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidPortOnUpdate(ScheduleWriteDto record) {
            return context.Ports.SingleOrDefault(x => x.Id == record.PortId) != null;
        }

    }

}