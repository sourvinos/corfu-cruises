using API.Features.Nationalities;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Features.Nationalities {

    public class Nationalities : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new NationalityValidator()
                .TestValidate(new NationalityWriteResource { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Code(string code) {
            new NationalityValidator()
                .TestValidate(new NationalityWriteResource { Code = code })
                .ShouldHaveValidationErrorFor(x => x.Code);
        }

    }

}