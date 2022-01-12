using FluentValidation;

namespace API.Features.Routes {

    public class RouteValidator : AbstractValidator<RouteWriteResource> {

        public RouteValidator() {
            RuleFor(x => x.PortId).NotNull();
            RuleFor(x => x.Abbreviation).NotEmpty().MaximumLength(10);
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsTransfer).NotNull();
        }

    }

}