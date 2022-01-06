using API.Features.Ships.Crews;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Ships.Crews {

    public class CrewsTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateLastname))]
        public void Invalid_Lastname(CrewWriteResource record) {
            new CrewValidator().ShouldHaveValidationErrorFor(model => model.Lastname, record.Lastname);
        }

        [Theory]
        [ClassData(typeof(ValidateFirstname))]
        public void Invalid_Firstname(CrewWriteResource record) {
            new CrewValidator().ShouldHaveValidationErrorFor(model => model.Firstname, record.Firstname);
        }

    }

}