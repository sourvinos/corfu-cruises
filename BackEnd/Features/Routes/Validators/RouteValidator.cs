using FluentValidation;

namespace BlueWaterCruises.Features.Routes {

    public class RouteValidator : AbstractValidator<Route> {

        public RouteValidator() {
            RuleFor(x => x.PortId).NotNull().NotEmpty();
            RuleFor(x => x.Abbreviation).NotNull().NotEmpty().MaximumLength(10);
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsTransfer).NotNull();
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}