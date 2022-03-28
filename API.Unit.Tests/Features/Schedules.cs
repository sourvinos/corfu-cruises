using API.Features.Schedules;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Features.Schedules {

    public class Schedules : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_DestinationId(int destinationId) {
            new ScheduleValidator()
                .TestValidate(new ScheduleWriteDto { DestinationId = destinationId })
                .ShouldHaveValidationErrorFor(x => x.DestinationId);
        }

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_PortId(int portId) {
            new ScheduleValidator()
                .TestValidate(new ScheduleWriteDto { PortId = portId })
                .ShouldHaveValidationErrorFor(x => x.PortId);
        }

        [Theory]
        [ClassData(typeof(ValidateDate))]
        public void Invalid_Date(string date) {
            new ScheduleValidator()
                .TestValidate(new ScheduleWriteDto { Date = date })
                .ShouldHaveValidationErrorFor(x => x.Date);
        }

        [Theory]
        [ClassData(typeof(ValidateInteger))]
        public void Invalid_MaxPassengers(int maxPassengers) {
            new ScheduleValidator()
                .TestValidate(new ScheduleWriteDto { MaxPassengers = maxPassengers })
                .ShouldHaveValidationErrorFor(x => x.MaxPassengers);
        }

    }

}