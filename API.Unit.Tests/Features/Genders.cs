using API.Features.Genders;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Features.Genders {

    public class Genders : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Description(string description) {
            new GenderValidator()
                .TestValidate(new GenderWriteResource { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

    }

}