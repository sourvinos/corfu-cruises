using FluentValidation;

namespace BlueWaterCruises.Features.Drivers {

    public class DriverValidator : AbstractValidator<Driver> {

        public DriverValidator() {
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.Phones).MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}