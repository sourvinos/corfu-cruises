using API.Features.Destinations;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Features.Destinations {

    public class Destinations : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Abbreviation(string abbreviation) {
            new DestinationValidator()
                .TestValidate(new DestinationWriteDto { Abbreviation = abbreviation })
                .ShouldHaveValidationErrorFor(x => x.Abbreviation);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new DestinationValidator()
                .TestValidate(new DestinationWriteDto { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

    }

}