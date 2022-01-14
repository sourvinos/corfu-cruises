using API.Features.Ports;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Features.Ports {

    public class Ports : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new PortValidator()
                .TestValidate(new PortWriteResource { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

    }

}