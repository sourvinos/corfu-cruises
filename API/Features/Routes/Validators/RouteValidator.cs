using FluentValidation;

namespace API.Features.Routes {

    public class RouteValidator : AbstractValidator<RouteWriteResource> {

        public RouteValidator() {
            RuleFor(x => x.PortId).NotEmpty();
            RuleFor(x => x.Abbreviation).NotEmpty().MaximumLength(10);
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
        }

    }

}