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
                .TestValidate(new ScheduleWriteResource { DestinationId = destinationId })
                .ShouldHaveValidationErrorFor(x => x.DestinationId);
        }

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_PortId(int portId) {
            new ScheduleValidator()
                .TestValidate(new ScheduleWriteResource { PortId = portId })
                .ShouldHaveValidationErrorFor(x => x.PortId);
        }

        [Theory]
        [ClassData(typeof(ValidateDate))]
        public void Invalid_Date(string date) {
            new ScheduleValidator()
                .TestValidate(new ScheduleWriteResource { Date = date })
                .ShouldHaveValidationErrorFor(x => x.Date);
        }

        [Theory]
        [ClassData(typeof(ValidateInteger))]
        public void Invalid_MaxPersons(int maxPersons) {
            new ScheduleValidator()
                .TestValidate(new ScheduleWriteResource { MaxPersons = maxPersons })
                .ShouldHaveValidationErrorFor(x => x.MaxPersons);
        }

    }

}