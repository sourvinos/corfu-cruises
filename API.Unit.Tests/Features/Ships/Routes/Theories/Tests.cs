using API.Features.Ships.Routes;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Ships.Routes {

    public class RoutesTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateDescription))]
        public void Invalid_Description(ShipRouteWriteResource record) {
            new ShipRouteValidator().ShouldHaveValidationErrorFor(model => model.Description, record.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateFromPort))]
        public void Invalid_FromPort(ShipRouteWriteResource record) {
            new ShipRouteValidator().ShouldHaveValidationErrorFor(model => model.FromPort, record.FromPort);
        }

        [Theory]
        [ClassData(typeof(ValidateFromTime))]
        public void Invalid_FromTime(ShipRouteWriteResource record) {
            new ShipRouteValidator().ShouldHaveValidationErrorFor(model => model.FromTime, record.FromTime);
        }

    }

}