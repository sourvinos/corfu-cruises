using BackEnd.UnitTests.Infrastructure;
using BlueWaterCruises.Features.Destinations;
using FluentValidation.TestHelper;
using Xunit;

namespace BackEnd.UnitTests.Destinations {

    public class DestinationTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateAbbreviation))]
        public void Invalid_Abbreviation(DestinationWriteResource record) {
            new DestinationValidator().ShouldHaveValidationErrorFor(model => model.Abbreviation, record.Abbreviation);
        }

        [Theory]
        [ClassData(typeof(ValidateDescription))]
        public void Invalid_Description(DestinationWriteResource record) {
            new DestinationValidator().ShouldHaveValidationErrorFor(model => model.Description, record.Description);
        }

    }

}