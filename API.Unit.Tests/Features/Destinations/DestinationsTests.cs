using API.Features.Destinations;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Destinations {

    public class DestinationTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Abbreviation(string abbreviation) {
            new DestinationValidator()
                .TestValidate(new DestinationWriteResource { Abbreviation = abbreviation })
                .ShouldHaveValidationErrorFor(x => x.Abbreviation);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Description(string description) {
            new DestinationValidator()
                .TestValidate(new DestinationWriteResource { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

    }

}