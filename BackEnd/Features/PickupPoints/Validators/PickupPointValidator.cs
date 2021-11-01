using System.Text.RegularExpressions;
using FluentValidation;

namespace BlueWaterCruises.Features.PickupPoints {

    public class PickupPointValidator : AbstractValidator<PickupPointWriteResource> {

        public PickupPointValidator() {
            RuleFor(x => x.RouteId).NotEmpty();
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.ExactPoint).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Time).Must(IsTime);
            RuleFor(x => x.Coordinates).NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull();
        }

        private bool IsTime(string time) {
            return new Regex(@"^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$").IsMatch(time);
        }

    }

}