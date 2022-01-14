using API.Features.PickupPoints;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Features.PickupPoints {

    public class PickupPoints : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_RouteId(int routeId) {
            new PickupPointValidator()
                .TestValidate(new PickupPointWriteResource { RouteId = routeId })
                .ShouldHaveValidationErrorFor(x => x.RouteId);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new PickupPointValidator()
                .TestValidate(new PickupPointWriteResource { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_ExactPoint(string exactPoint) {
            new PickupPointValidator()
                .TestValidate(new PickupPointWriteResource { ExactPoint = exactPoint })
                .ShouldHaveValidationErrorFor(x => x.ExactPoint);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateTime))]
        public void Invalid_Time(string time) {
            new PickupPointValidator()
                .TestValidate(new PickupPointWriteResource { Time = time })
                .ShouldHaveValidationErrorFor(x => x.Time);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Coordinates(string coordinates) {
            new PickupPointValidator()
                .TestValidate(new PickupPointWriteResource { Coordinates = coordinates })
                .ShouldHaveValidationErrorFor(x => x.Coordinates);
        }

    }

}