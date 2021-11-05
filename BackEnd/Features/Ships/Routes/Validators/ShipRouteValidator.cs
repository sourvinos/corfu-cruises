using FluentValidation;

namespace BlueWaterCruises.Features.ShipRoutes {

    public class ShipRouteValidator : AbstractValidator<ShipRouteWriteResource> {

        public ShipRouteValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.FromPort).NotEmpty().MaximumLength(128);
            RuleFor(x => x.FromTime).NotEmpty().MaximumLength(5);
            RuleFor(x => x.ViaPort).MaximumLength(128);
            RuleFor(x => x.ViaTime).MaximumLength(5);
            RuleFor(x => x.ToPort).NotEmpty().MaximumLength(128);
            RuleFor(x => x.ToTime).NotEmpty().MaximumLength(5);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull();
        }

    }

}