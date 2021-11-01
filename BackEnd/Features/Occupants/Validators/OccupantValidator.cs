using FluentValidation;

namespace BlueWaterCruises.Features.Occupants {

    public class OccupantValidator : AbstractValidator<OccupantWriteResource> {

        public OccupantValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull();
        }

    }

}