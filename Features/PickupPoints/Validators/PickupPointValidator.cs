using FluentValidation;

namespace BlueWaterCruises.Features.PickupPoints {

    public class PickupPointValidator : AbstractValidator<PickupPoint> {

        public PickupPointValidator() {
            RuleFor(x => x.RouteId).NotNull().NotEmpty();
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.ExactPoint).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.Time).NotNull().NotEmpty().MaximumLength(5);
            RuleFor(x => x.Coordinates).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}