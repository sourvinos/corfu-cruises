using FluentValidation;

namespace BlueWaterCruises.Features.Destinations {

    public class DestinationValidator : AbstractValidator<Destination> {

        public DestinationValidator() {
            RuleFor(x => x.Abbreviation).NotNull().NotEmpty().MaximumLength(5);
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull();
        }

    }

}