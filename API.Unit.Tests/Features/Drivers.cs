using API.Features.Drivers;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Features.Drivers {

    public class Drivers : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new DriverValidator()
                .TestValidate(new DriverWriteResource { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Phones(string phones) {
            new DriverValidator()
                .TestValidate(new DriverWriteResource { Phones = phones })
                .ShouldHaveValidationErrorFor(x => x.Phones);
        }

    }

}