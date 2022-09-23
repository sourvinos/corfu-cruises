using API.Features.Ports;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Features.Ports {

    public class Ports : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Abbreviation(string abbreviation) {
            new PortValidator()
                .TestValidate(new PortWriteDto { Abbreviation = abbreviation })
                .ShouldHaveValidationErrorFor(x => x.Abbreviation);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new PortValidator()
                .TestValidate(new PortWriteDto { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateIntegerBetweenOneAndTen))]
        public void Invalid_Sequence(int sequence) {
            new PortValidator()
                .TestValidate(new PortWriteDto { Sequence = sequence })
                .ShouldHaveValidationErrorFor(x => x.Sequence);
        }

    }

}