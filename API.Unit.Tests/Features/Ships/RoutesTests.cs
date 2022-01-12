using API.Features.Ships.Routes;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Ships.Routes {

    public class RoutesTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Description(string description) {
            new ShipRouteValidator()
                .TestValidate(new ShipRouteWriteResource { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_FromPort(string fromPort) {
            new ShipRouteValidator()
                .TestValidate(new ShipRouteWriteResource { FromPort = fromPort })
                .ShouldHaveValidationErrorFor(x => x.FromPort);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateTime))]
        public void Invalid_FromTime(string fromTime) {
            new ShipRouteValidator()
                .TestValidate(new ShipRouteWriteResource { FromTime = fromTime })
                .ShouldHaveValidationErrorFor(x => x.FromTime);
        }

        [Theory]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_ViaPort(string viaPort) {
            new ShipRouteValidator()
                .TestValidate(new ShipRouteWriteResource { ViaPort = viaPort })
                .ShouldHaveValidationErrorFor(x => x.ViaPort);
        }

        [Theory]
        [ClassData(typeof(ValidateTime))]
        public void Invalid_ViaTime(string viaTime) {
            new ShipRouteValidator()
                .TestValidate(new ShipRouteWriteResource { ViaTime = viaTime })
                .ShouldHaveValidationErrorFor(x => x.ViaTime);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_ToPort(string toPort) {
            new ShipRouteValidator()
                .TestValidate(new ShipRouteWriteResource { ToPort = toPort })
                .ShouldHaveValidationErrorFor(x => x.ToPort);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateTime))]
        public void Invalid_ToTime(string toTime) {
            new ShipRouteValidator()
                .TestValidate(new ShipRouteWriteResource { ToTime = toTime })
                .ShouldHaveValidationErrorFor(x => x.ToTime);
        }

    }

}