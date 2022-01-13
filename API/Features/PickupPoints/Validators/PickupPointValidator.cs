using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Features.PickupPoints {

    public class PickupPointValidator : AbstractValidator<PickupPointWriteResource> {

        public PickupPointValidator() {
            RuleFor(x => x.RouteId).NotEmpty();
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.ExactPoint).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Time).Must(TimeHelpers.BeValidTime);
            RuleFor(x => x.Coordinates).NotEmpty().MaximumLength(128);
        }

    }

}