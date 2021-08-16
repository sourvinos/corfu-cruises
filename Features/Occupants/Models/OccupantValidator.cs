using FluentValidation;

namespace BlueWaterCruises.Features.Occupants {

    public class OccupantValidator : AbstractValidator<Occupant> {

        public OccupantValidator() {
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}