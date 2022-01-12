using API.Features.Occupants;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Features.Occupants {

    public class Occupants : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Description(string description) {
            new OccupantValidator()
                .TestValidate(new OccupantWriteResource { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

    }

}