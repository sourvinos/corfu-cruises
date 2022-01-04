using FluentValidation;

namespace API.Features.Occupants {

    public class OccupantValidator : AbstractValidator<OccupantWriteResource> {

        public OccupantValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
        }

    }

}