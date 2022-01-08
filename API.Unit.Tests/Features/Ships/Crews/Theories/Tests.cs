using API.Features.Ships.Crews;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Ships.Crews {

    public class CrewsTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateLastname))]
        public void Invalid_Lastname(string lastname) {
            new CrewValidator()
                .TestValidate(new CrewWriteResource { Lastname = lastname })
                .ShouldHaveValidationErrorFor(x => x.Lastname);
        }

        [Theory]
        [ClassData(typeof(ValidateFirstname))]
        public void Invalid_Firstname(string firstname) {
            new CrewValidator()
                .TestValidate(new CrewWriteResource { Firstname = firstname })
                .ShouldHaveValidationErrorFor(x => x.Firstname);
        }

    }

}