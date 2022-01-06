using API.Features.Drivers;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Drivers {

    public class DriverTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateDescription))]
        public void Invalid_Description(DriverWriteResource record) {
            new DriverValidator().ShouldHaveValidationErrorFor(model => model.Description, record.Description);
        }

        [Theory]
        [ClassData(typeof(ValidatePhones))]
        public void Invalid_Abbreviation(DriverWriteResource record) {
            new DriverValidator().ShouldHaveValidationErrorFor(model => model.Phones, record.Phones);
        }

    }

}