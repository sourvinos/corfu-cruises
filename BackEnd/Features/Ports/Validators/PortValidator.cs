using FluentValidation;

namespace BlueWaterCruises.Features.Ports {

    public class PortValidator : AbstractValidator<PortWriteResource> {

        public PortValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsPrimary).NotNull();
            RuleFor(x => x.IsActive).NotNull();
        }

    }

}