using FluentValidation;

namespace ShipCruises {

    public class ShipRouteValidator : AbstractValidator<ShipRoute> {

        public ShipRouteValidator() {
            RuleFor(x => x.Description).NotNull().NotEmpty();
            RuleFor(x => x.FromPort).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.FromTime).NotNull().NotEmpty().MaximumLength(5);
            RuleFor(x => x.ViaPort).NotNull().MaximumLength(128);
            RuleFor(x => x.ViaTime).NotNull().MaximumLength(5);
            RuleFor(x => x.ToPort).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.ToTime).NotNull().MaximumLength(5);;
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(36);
        }

    }

}