using FluentValidation;

namespace API.Features.Destinations {

    public class DestinationValidator : AbstractValidator<DestinationWriteResource> {

        public DestinationValidator() {
            RuleFor(x => x.Abbreviation).NotEmpty().MaximumLength(5);
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
        }

    }

}