using FluentValidation;

namespace BlueWaterCruises.Features.Routes {

    public class RouteValidator : AbstractValidator<RouteWriteResource> {

        public RouteValidator() {
            RuleFor(x => x.PortId).NotNull();
            RuleFor(x => x.Abbreviation).NotEmpty().MaximumLength(10);
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsTransfer).NotNull();
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull();
        }

    }

}