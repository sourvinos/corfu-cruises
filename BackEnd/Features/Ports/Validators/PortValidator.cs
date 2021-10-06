using FluentValidation;

namespace BlueWaterCruises.Features.Ports {

    public class PortValidator : AbstractValidator<Port> {

        public PortValidator() {
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}