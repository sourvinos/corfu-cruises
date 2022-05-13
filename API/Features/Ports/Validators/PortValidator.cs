using FluentValidation;

namespace API.Features.Ports {

    public class PortValidator : AbstractValidator<PortWriteResource> {

        public PortValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Abbreviation).NotEmpty().MaximumLength(5);
        }

    }

}