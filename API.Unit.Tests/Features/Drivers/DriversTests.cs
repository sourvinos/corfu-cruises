using API.Features.Drivers;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Drivers {

    public class DriverTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Description(string description) {
            new DriverValidator()
                .TestValidate(new DriverWriteResource { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Phones(string phones) {
            new DriverValidator()
                .TestValidate(new DriverWriteResource { Phones = phones })
                .ShouldHaveValidationErrorFor(x => x.Phones);
        }

    }

}