using FluentValidation;

namespace API.Features.Drivers {

    public class DriverValidator : AbstractValidator<DriverWriteResource> {

        public DriverValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Phones).MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
        }

    }

}