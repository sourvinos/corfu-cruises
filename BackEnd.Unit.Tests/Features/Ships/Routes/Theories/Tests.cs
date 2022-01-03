using BackEnd.UnitTests.Infrastructure;
using BlueWaterCruises.Features.Ships.Routes;
using FluentValidation.TestHelper;
using Xunit;

namespace BackEnd.UnitTests.Ships.Routes {

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