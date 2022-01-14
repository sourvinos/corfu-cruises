using API.Features.Routes;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Features.Routes {

    public class Routes : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_PortId(int portId) {
            new RouteValidator()
                .TestValidate(new RouteWriteResource { PortId = portId })
                .ShouldHaveValidationErrorFor(x => x.PortId);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new RouteValidator()
                .TestValidate(new RouteWriteResource { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Abbreviation(string abbreviation) {
            new RouteValidator()
                .TestValidate(new RouteWriteResource { Abbreviation = abbreviation })
                .ShouldHaveValidationErrorFor(x => x.Abbreviation);
        }

    }

}