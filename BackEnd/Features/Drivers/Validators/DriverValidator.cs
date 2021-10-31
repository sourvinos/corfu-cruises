using FluentValidation;

namespace BlueWaterCruises.Features.Drivers {

    public class DriverValidator : AbstractValidator<DriverWriteResource> {

        public DriverValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Phones).NotNull().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull();
        }

    }

}